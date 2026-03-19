import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Upload, Trash2, Star, StarOff, ImagePlus, Loader2 } from "lucide-react";

interface GalleryImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  is_main: boolean;
  sort_order: number;
  active: boolean;
}

interface LineGalleryImage {
  id: string;
  line_slug: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  active: boolean;
}

const PROMO_LINES = [
  { slug: "tradicional", label: "Tradicional" },
  { slug: "vegetariana", label: "Vegetariana" },
  { slug: "fitness", label: "Fitness" },
  { slug: "low-carb", label: "Low Carb" },
];

type AdminTab = "galeria-geral" | "promocionais";

export default function AdminPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lineFileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<AdminTab>("galeria-geral");
  const [activeLineSlug, setActiveLineSlug] = useState<string>("tradicional");

  // General gallery state
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Line gallery state
  const [lineImages, setLineImages] = useState<LineGalleryImage[]>([]);
  const [lineLoading, setLineLoading] = useState(false);
  const [lineUploading, setLineUploading] = useState(false);

  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Check auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/admin/login");
      else fetchImages();
    });
  }, []);

  // Fetch line images when tab/slug changes
  useEffect(() => {
    if (activeTab === "promocionais") {
      fetchLineImages(activeLineSlug);
    }
  }, [activeTab, activeLineSlug]);

  const fetchImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("promo_gallery")
      .select("*")
      .order("sort_order");
    if (!error && data) setImages(data as GalleryImage[]);
    setLoading(false);
  };

  const fetchLineImages = async (slug: string) => {
    setLineLoading(true);
    const { data, error } = await supabase
      .from("promo_line_gallery")
      .select("*")
      .eq("line_slug", slug)
      .order("sort_order");
    if (!error && data) setLineImages(data as LineGalleryImage[]);
    setLineLoading(false);
  };

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  };

  // ─── General gallery handlers ───

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let uploadedCount = 0;

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: storageError } = await supabase.storage
        .from("promo-gallery")
        .upload(fileName, file, { upsert: false });

      if (storageError) {
        showMessage(`Erro ao enviar ${file.name}: ${storageError.message}`, "error");
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("promo-gallery")
        .getPublicUrl(fileName);

      const nextOrder = images.length + uploadedCount;
      const { error: dbError } = await supabase.from("promo_gallery").insert({
        image_url: urlData.publicUrl,
        alt_text: file.name.replace(/\.[^.]+$/, ""),
        is_main: images.length === 0 && uploadedCount === 0,
        sort_order: nextOrder,
        active: true,
      });

      if (dbError) {
        showMessage(`Erro ao salvar ${file.name}: ${dbError.message}`, "error");
      } else {
        uploadedCount++;
      }
    }

    if (uploadedCount > 0) {
      showMessage(`${uploadedCount} foto(s) enviada(s) com sucesso!`, "success");
      fetchImages();
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSetMain = async (id: string) => {
    await supabase.from("promo_gallery").update({ is_main: false }).neq("id", "none");
    await supabase.from("promo_gallery").update({ is_main: true }).eq("id", id);
    showMessage("Foto principal definida!", "success");
    fetchImages();
  };

  const handleToggleActive = async (img: GalleryImage) => {
    await supabase.from("promo_gallery").update({ active: !img.active }).eq("id", img.id);
    fetchImages();
  };

  const handleDelete = async (img: GalleryImage) => {
    if (!confirm("Tem certeza que deseja excluir esta foto?")) return;
    const fileName = img.image_url.split("/promo-gallery/").pop();
    if (fileName) {
      await supabase.storage.from("promo-gallery").remove([fileName]);
    }
    await supabase.from("promo_gallery").delete().eq("id", img.id);
    showMessage("Foto excluída.", "success");
    fetchImages();
  };

  // ─── Line gallery handlers ───

  const handleLineUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLineUploading(true);
    let uploadedCount = 0;

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const fileName = `${activeLineSlug}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: storageError } = await supabase.storage
        .from("promo-line-gallery")
        .upload(fileName, file, { upsert: false });

      if (storageError) {
        showMessage(`Erro ao enviar ${file.name}: ${storageError.message}`, "error");
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("promo-line-gallery")
        .getPublicUrl(fileName);

      const nextOrder = lineImages.length + uploadedCount;
      const { error: dbError } = await supabase.from("promo_line_gallery").insert({
        line_slug: activeLineSlug,
        image_url: urlData.publicUrl,
        alt_text: file.name.replace(/\.[^.]+$/, ""),
        sort_order: nextOrder,
        active: true,
      });

      if (dbError) {
        showMessage(`Erro ao salvar ${file.name}: ${dbError.message}`, "error");
      } else {
        uploadedCount++;
      }
    }

    if (uploadedCount > 0) {
      showMessage(`${uploadedCount} foto(s) enviada(s) com sucesso!`, "success");
      fetchLineImages(activeLineSlug);
    }

    setLineUploading(false);
    if (lineFileInputRef.current) lineFileInputRef.current.value = "";
  };

  const handleLineToggleActive = async (img: LineGalleryImage) => {
    await supabase.from("promo_line_gallery").update({ active: !img.active }).eq("id", img.id);
    fetchLineImages(activeLineSlug);
  };

  const handleLineDelete = async (img: LineGalleryImage) => {
    if (!confirm("Tem certeza que deseja excluir esta foto?")) return;
    const fileName = img.image_url.split("/promo-line-gallery/").pop();
    if (fileName) {
      await supabase.storage.from("promo-line-gallery").remove([fileName]);
    }
    await supabase.from("promo_line_gallery").delete().eq("id", img.id);
    showMessage("Foto excluída.", "success");
    fetchLineImages(activeLineSlug);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const activeLineLabel = PROMO_LINES.find((l) => l.slug === activeLineSlug)?.label || "";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-primary-foreground text-lg">
            Solaris — Admin
          </h1>
          <p className="text-primary-foreground/70 text-xs">Painel de gerenciamento</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
        >
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </header>

      {/* Tabs */}
      <div className="border-b border-border bg-card">
        <div className="container px-4 flex gap-0">
          <button
            onClick={() => setActiveTab("galeria-geral")}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "galeria-geral"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Galeria Geral
          </button>
          <button
            onClick={() => setActiveTab("promocionais")}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "promocionais"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Promocionais
          </button>
        </div>
      </div>

      <main className="container px-4 py-8 max-w-3xl mx-auto space-y-6">
        {/* Message */}
        {message && (
          <div className={`rounded-xl px-4 py-3 text-sm font-medium ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-destructive/10 text-destructive border border-destructive/20"
          }`}>
            {message.text}
          </div>
        )}

        {/* ─── Tab: Galeria Geral ─── */}
        {activeTab === "galeria-geral" && (
          <>
            <h2 className="font-display font-bold text-foreground text-lg">Galeria do Combo Promocional</h2>

            {/* Upload area */}
            <div className="bg-card border-2 border-dashed border-border rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <ImagePlus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Adicionar fotos ao combo promocional</p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  JPG, PNG ou WebP. Pode selecionar várias de uma vez.
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleUpload}
              />
              <Button
                variant="cta"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</>
                ) : (
                  <><Upload className="h-4 w-4" /> Selecionar fotos</>
                )}
              </Button>
            </div>

            {/* Instructions */}
            <div className="bg-accent border border-primary/20 rounded-xl px-4 py-3 text-xs text-muted-foreground space-y-1">
              <p><span className="font-semibold text-foreground">⭐ Foto principal</span> — aparece grande no site (banner). Clique na estrela para definir qual é.</p>
              <p><span className="font-semibold text-foreground">👁 Ativo/Oculto</span> — fotos ocultas não aparecem no site.</p>
              <p><span className="font-semibold text-foreground">🗑 Excluir</span> — remove permanentemente a foto.</p>
            </div>

            {/* Gallery list */}
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                Nenhuma foto cadastrada ainda.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                      img.is_main ? "border-primary shadow-md" : "border-border"
                    } ${!img.active ? "opacity-50" : ""}`}
                  >
                    {img.is_main && (
                      <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Principal
                      </div>
                    )}
                    <div className="aspect-square">
                      <img
                        src={img.image_url}
                        alt={img.alt_text ?? "foto"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2 flex items-center justify-between gap-1">
                      <button
                        onClick={() => handleSetMain(img.id)}
                        title={img.is_main ? "Já é a foto principal" : "Definir como principal"}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                          img.is_main
                            ? "bg-primary text-primary-foreground"
                            : "bg-white/20 text-white hover:bg-white/40"
                        }`}
                      >
                        {img.is_main ? <Star className="h-3.5 w-3.5 fill-current" /> : <StarOff className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        onClick={() => handleToggleActive(img)}
                        title={img.active ? "Ocultar do site" : "Mostrar no site"}
                        className="w-7 h-7 rounded-full bg-white/20 text-white hover:bg-white/40 flex items-center justify-center text-[11px] font-bold transition-colors"
                      >
                        {img.active ? "👁" : "🙈"}
                      </button>
                      <button
                        onClick={() => handleDelete(img)}
                        title="Excluir foto"
                        className="w-7 h-7 rounded-full bg-red-500/80 text-white hover:bg-red-600 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ─── Tab: Promocionais (por linha) ─── */}
        {activeTab === "promocionais" && (
          <>
            <h2 className="font-display font-bold text-foreground text-lg">Fotos por tipo de marmita</h2>
            <p className="text-muted-foreground text-sm -mt-4">
              Gerencie as fotos do carrossel de cada linha promocional.
            </p>

            {/* Line sub-tabs */}
            <div className="flex gap-2 flex-wrap">
              {PROMO_LINES.map((line) => (
                <button
                  key={line.slug}
                  onClick={() => setActiveLineSlug(line.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeLineSlug === line.slug
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                  }`}
                >
                  {line.label}
                </button>
              ))}
            </div>

            {/* Upload area for line */}
            <div className="bg-card border-2 border-dashed border-border rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <ImagePlus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">
                  Adicionar fotos — {activeLineLabel}
                </p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  JPG, PNG ou WebP. Pode selecionar várias de uma vez.
                </p>
              </div>
              <input
                ref={lineFileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleLineUpload}
              />
              <Button
                variant="cta"
                onClick={() => lineFileInputRef.current?.click()}
                disabled={lineUploading}
              >
                {lineUploading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</>
                ) : (
                  <><Upload className="h-4 w-4" /> Selecionar fotos</>
                )}
              </Button>
            </div>

            {/* Line gallery list */}
            {lineLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : lineImages.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                Nenhuma foto cadastrada para <strong>{activeLineLabel}</strong>.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {lineImages.map((img) => (
                  <div
                    key={img.id}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all border-border ${
                      !img.active ? "opacity-50" : ""
                    }`}
                  >
                    <div className="aspect-square">
                      <img
                        src={img.image_url}
                        alt={img.alt_text ?? "foto"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2 flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleLineToggleActive(img)}
                        title={img.active ? "Ocultar do site" : "Mostrar no site"}
                        className="w-7 h-7 rounded-full bg-white/20 text-white hover:bg-white/40 flex items-center justify-center text-[11px] font-bold transition-colors"
                      >
                        {img.active ? "👁" : "🙈"}
                      </button>
                      <button
                        onClick={() => handleLineDelete(img)}
                        title="Excluir foto"
                        className="w-7 h-7 rounded-full bg-red-500/80 text-white hover:bg-red-600 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
