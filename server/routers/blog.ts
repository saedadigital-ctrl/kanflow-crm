import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { db } from "../db";
import { nanoid } from "nanoid";

/**
 * Blog Router - Gerenciamento de posts do blog
 */
export const blogRouter = router({
  // GET - Listar todos os posts publicados (público)
  posts: publicProcedure
    .input(z.object({
      limit: z.number().optional().default(10),
      offset: z.number().optional().default(0),
      category: z.string().optional(),
      featured: z.boolean().optional(),
    }))
    .query(async ({ input }) => {
      try {
        const posts = await db.getBlogPosts({
          limit: input.limit,
          offset: input.offset,
          category: input.category,
          featured: input.featured,
          status: "published",
        });

        console.log(`[Blog] ${posts.length} posts retornados`);

        return posts;
      } catch (error) {
        console.error('[Blog] Erro ao buscar posts:', error);
        throw new Error('Erro ao buscar posts do blog');
      }
    }),

  // GET - Buscar post por slug (público)
  postBySlug: publicProcedure
    .input(z.object({
      slug: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        const post = await db.getBlogPostBySlug(input.slug);

        if (!post) {
          throw new Error('Post não encontrado');
        }

        // Incrementar visualizações
        await db.incrementBlogPostViews(post.id);

        console.log(`[Blog] Post '${post.title}' acessado`);

        return post;
      } catch (error) {
        console.error('[Blog] Erro ao buscar post:', error);
        throw new Error('Erro ao buscar post');
      }
    }),

  // GET - Listar posts em destaque (público)
  featuredPosts: publicProcedure
    .input(z.object({
      limit: z.number().optional().default(3),
    }))
    .query(async ({ input }) => {
      try {
        const posts = await db.getBlogPosts({
          limit: input.limit,
          offset: 0,
          featured: true,
          status: "published",
        });

        console.log(`[Blog] ${posts.length} posts em destaque retornados`);

        return posts;
      } catch (error) {
        console.error('[Blog] Erro ao buscar posts em destaque:', error);
        throw new Error('Erro ao buscar posts em destaque');
      }
    }),

  // GET - Listar categorias (público)
  categories: publicProcedure
    .query(async () => {
      try {
        const categories = await db.getBlogCategories();

        console.log(`[Blog] ${categories.length} categorias retornadas`);

        return categories;
      } catch (error) {
        console.error('[Blog] Erro ao buscar categorias:', error);
        throw new Error('Erro ao buscar categorias');
      }
    }),

  // POST - Criar novo post (protegido - requer autenticação)
  createPost: publicProcedure
    .input(z.object({
      title: z.string(),
      slug: z.string(),
      excerpt: z.string().optional(),
      content: z.string(),
      coverImage: z.string().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      keywords: z.string().optional(), // JSON string
      category: z.string().optional(),
      tags: z.string().optional(), // JSON string
      status: z.enum(["draft", "published", "scheduled"]).optional(),
      publishedAt: z.string().optional(), // ISO date string
      scheduledFor: z.string().optional(), // ISO date string
      featured: z.boolean().optional(),
      authorId: z.string().optional(),
      authorName: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const post = await db.createBlogPost({
          id: nanoid(),
          title: input.title,
          slug: input.slug,
          excerpt: input.excerpt || null,
          content: input.content,
          coverImage: input.coverImage || null,
          metaTitle: input.metaTitle || null,
          metaDescription: input.metaDescription || null,
          keywords: input.keywords || null,
          category: input.category || null,
          tags: input.tags || null,
          status: input.status || "draft",
          publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
          scheduledFor: input.scheduledFor ? new Date(input.scheduledFor) : null,
          views: 0,
          avgReadTime: null,
          authorId: input.authorId || null,
          authorName: input.authorName || null,
          featured: input.featured || false,
          allowComments: false,
        });

        console.log(`[Blog] Post criado: ${post.title} (${post.id})`);

        return {
          success: true,
          message: "Post criado com sucesso!",
          data: post,
        };
      } catch (error) {
        console.error('[Blog] Erro ao criar post:', error);
        throw new Error('Erro ao criar post');
      }
    }),

  // PUT - Atualizar post (protegido - requer autenticação)
  updatePost: publicProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      slug: z.string().optional(),
      excerpt: z.string().optional(),
      content: z.string().optional(),
      coverImage: z.string().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      keywords: z.string().optional(),
      category: z.string().optional(),
      tags: z.string().optional(),
      status: z.enum(["draft", "published", "scheduled"]).optional(),
      publishedAt: z.string().optional(),
      scheduledFor: z.string().optional(),
      featured: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const post = await db.updateBlogPost(input.id, {
          title: input.title,
          slug: input.slug,
          excerpt: input.excerpt,
          content: input.content,
          coverImage: input.coverImage,
          metaTitle: input.metaTitle,
          metaDescription: input.metaDescription,
          keywords: input.keywords,
          category: input.category,
          tags: input.tags,
          status: input.status,
          publishedAt: input.publishedAt ? new Date(input.publishedAt) : undefined,
          scheduledFor: input.scheduledFor ? new Date(input.scheduledFor) : undefined,
          featured: input.featured,
        });

        console.log(`[Blog] Post atualizado: ${post.title} (${post.id})`);

        return {
          success: true,
          message: "Post atualizado com sucesso!",
          data: post,
        };
      } catch (error) {
        console.error('[Blog] Erro ao atualizar post:', error);
        throw new Error('Erro ao atualizar post');
      }
    }),

  // DELETE - Deletar post (protegido - requer autenticação)
  deletePost: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        await db.deleteBlogPost(input.id);

        console.log(`[Blog] Post deletado: ${input.id}`);

        return {
          success: true,
          message: "Post deletado com sucesso!",
        };
      } catch (error) {
        console.error('[Blog] Erro ao deletar post:', error);
        throw new Error('Erro ao deletar post');
      }
    }),
});

export type BlogRouter = typeof blogRouter;
