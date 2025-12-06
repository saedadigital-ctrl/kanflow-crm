import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { ArrowLeft, Save, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUpload from '@/components/ImageUpload';
import RichTextEditor from '@/components/RichTextEditor';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import slugify from 'slugify';
import { nanoid } from 'nanoid';

export default function BlogPostEditor() {
  const [, params] = useRoute('/blog/edit/:id');
  const [, setLocation] = useLocation();
  const isEditing = !!params?.id;

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('draft');
  const [featured, setFeatured] = useState(false);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [authorName, setAuthorName] = useState('Adriano Castro');

  // Load post if editing
  const { data: post, isLoading: loadingPost } = trpc.blog.postBySlug.useQuery(
    { slug: params?.id || '' },
    { enabled: isEditing }
  );

  useEffect(() => {
    if (post && isEditing) {
      setTitle(post.title);
      setSlug(post.slug);
      setExcerpt(post.excerpt || '');
      setContent(post.content);
      setCoverImage(post.coverImage || '');
      setCategory(post.category || '');
      setTags(post.tags ? JSON.parse(post.tags).join(', ') : '');
      setStatus(post.status as any);
      setFeatured(post.featured);
      setMetaTitle(post.metaTitle || '');
      setMetaDescription(post.metaDescription || '');
      setKeywords(post.keywords ? JSON.parse(post.keywords).join(', ') : '');
      setAuthorName(post.authorName || 'Adriano Castro');
    }
  }, [post, isEditing]);

  // Mutations
  const createPost = trpc.blog.createPost.useMutation({
    onSuccess: () => {
      toast.success('Post criado com sucesso!');
      setLocation('/blog');
    },
    onError: (error) => {
      toast.error(`Erro ao criar post: ${error.message}`);
    },
  });

  const updatePost = trpc.blog.updatePost.useMutation({
    onSuccess: () => {
      toast.success('Post atualizado com sucesso!');
      setLocation('/blog');
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar post: ${error.message}`);
    },
  });

  // Auto-generate slug from title
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!isEditing) {
      setSlug(slugify(newTitle, { lower: true, strict: true }));
    }
  };

  // Save post
  const handleSave = () => {
    // Validations
    if (!title.trim()) {
      toast.error('Título é obrigatório!');
      return;
    }
    if (!slug.trim()) {
      toast.error('Slug é obrigatório!');
      return;
    }
    if (!content.trim()) {
      toast.error('Conteúdo é obrigatório!');
      return;
    }

    const postData = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || undefined,
      content: content.trim(),
      coverImage: coverImage.trim() || undefined,
      category: category.trim() || undefined,
      tags: tags.trim() ? JSON.stringify(tags.split(',').map(t => t.trim())) : undefined,
      status,
      publishedAt: status === 'published' ? new Date().toISOString() : undefined,
      featured,
      metaTitle: metaTitle.trim() || undefined,
      metaDescription: metaDescription.trim() || undefined,
      keywords: keywords.trim() ? JSON.stringify(keywords.split(',').map(k => k.trim())) : undefined,
      authorName: authorName.trim() || undefined,
    };

    if (isEditing && post) {
      updatePost.mutate({ id: post.id, ...postData });
    } else {
      createPost.mutate({ id: nanoid(), ...postData });
    }
  };

  if (loadingPost) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Carregando post...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation('/blog')}
              >
                <ArrowLeft size={20} />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {isEditing ? 'Editar Post' : 'Novo Post'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {isEditing ? 'Atualize as informações do post' : 'Crie um novo post para o blog'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => window.open(`https://adrianocastroimoveis.manus.space/blog/${slug}`, '_blank')}
                disabled={!slug || status !== 'published'}
              >
                <Eye size={16} className="mr-2" />
                Preview
              </Button>
              <Button
                onClick={handleSave}
                disabled={createPost.isPending || updatePost.isPending}
              >
                {(createPost.isPending || updatePost.isPending) ? (
                  <Loader2 size={16} className="mr-2 animate-spin" />
                ) : (
                  <Save size={16} className="mr-2" />
                )}
                {isEditing ? 'Atualizar' : 'Publicar'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Digite o título do post..."
                className="text-lg"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="titulo-do-post"
              />
              <p className="text-xs text-muted-foreground">
                URL: https://adrianocastroimoveis.manus.space/blog/{slug || 'seu-slug'}
              </p>
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label htmlFor="excerpt">Resumo</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Breve resumo do post (aparece na listagem)..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {excerpt.length}/160 caracteres
              </p>
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
              <Label>Imagem de Capa</Label>
              <ImageUpload
                value={coverImage}
                onChange={setCoverImage}
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo *</Label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Escreva o conteúdo do post aqui..."
              />
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lancamentos">Lançamentos</SelectItem>
                    <SelectItem value="dicas">Dicas</SelectItem>
                    <SelectItem value="mercado">Mercado</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                    <SelectItem value="scheduled">Agendado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="ghc, altiplano, luxo (separadas por vírgula)"
              />
            </div>

            {/* Author */}
            <div className="space-y-2">
              <Label htmlFor="author">Autor</Label>
              <Input
                id="author"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Nome do autor"
              />
            </div>

            {/* Featured */}
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <Label htmlFor="featured" className="text-base">Post em Destaque</Label>
                <p className="text-sm text-muted-foreground">
                  Exibir este post na seção de destaques da home
                </p>
              </div>
              <Switch
                id="featured"
                checked={featured}
                onCheckedChange={setFeatured}
              />
            </div>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo" className="space-y-6">
            {/* Meta Title */}
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Título para SEO (deixe em branco para usar o título do post)"
              />
              <p className="text-xs text-muted-foreground">
                {metaTitle.length}/60 caracteres
              </p>
            </div>

            {/* Meta Description */}
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Descrição para SEO (deixe em branco para usar o resumo)"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {metaDescription.length}/160 caracteres
              </p>
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="palavra-chave1, palavra-chave2, palavra-chave3"
              />
              <p className="text-xs text-muted-foreground">
                Palavras-chave separadas por vírgula
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
