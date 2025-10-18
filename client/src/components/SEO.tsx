import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
}

export function SEO({
  title = "KanFlow - CRM Profissional para WhatsApp | Aumente suas Vendas com IA",
  description = "Transforme seu WhatsApp em uma máquina de vendas com o KanFlow. CRM completo com Kanban de conversas, automação inteligente, agentes de IA e dashboards avançados. Teste grátis por 14 dias sem cartão de crédito.",
  keywords = "CRM WhatsApp, automação WhatsApp, CRM para WhatsApp Business, gerenciador de conversas WhatsApp, kanban WhatsApp, vendas WhatsApp, atendimento WhatsApp, chatbot WhatsApp, IA para WhatsApp, pipeline de vendas WhatsApp, funil de vendas WhatsApp, gestão de leads WhatsApp, multi atendimento WhatsApp, sistema CRM Brasil",
  ogImage = "/og-image.png",
  ogUrl = "https://kanflow.com.br",
  canonical,
}: SEOProps) {
  useEffect(() => {
    // Set document title
    document.title = title;

    // Set or update meta tags
    const metaTags = [
      { name: "description", content: description },
      { name: "keywords", content: keywords },
      { name: "author", content: "Studio AEDA Digital" },
      { name: "robots", content: "index, follow" },
      { name: "language", content: "Portuguese" },
      { name: "revisit-after", content: "7 days" },
      
      // Open Graph / Facebook
      { property: "og:type", content: "website" },
      { property: "og:url", content: ogUrl },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: ogImage },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: "KanFlow" },
      
      // Twitter
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:url", content: ogUrl },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
      
      // Mobile
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { name: "theme-color", content: "#1E40AF" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
    ];

    metaTags.forEach(({ name, property, content }) => {
      const attribute = name ? "name" : "property";
      const value = name || property;
      
      let element = document.querySelector(`meta[${attribute}="${value}"]`);
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, value!);
        document.head.appendChild(element);
      }
      
      element.setAttribute("content", content);
    });

    // Set canonical URL
    if (canonical) {
      let linkElement = document.querySelector('link[rel="canonical"]');
      
      if (!linkElement) {
        linkElement = document.createElement("link");
        linkElement.setAttribute("rel", "canonical");
        document.head.appendChild(linkElement);
      }
      
      linkElement.setAttribute("href", canonical);
    }

    // Add JSON-LD structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "KanFlow",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web, iOS, Android",
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "BRL",
        "lowPrice": "99",
        "highPrice": "999",
        "offerCount": "3"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1000",
        "bestRating": "5",
        "worstRating": "1"
      },
      "description": description,
      "image": ogImage,
      "url": ogUrl,
      "author": {
        "@type": "Organization",
        "name": "Studio AEDA Digital"
      },
      "provider": {
        "@type": "Organization",
        "name": "KanFlow",
        "url": ogUrl
      }
    };

    let scriptElement = document.querySelector('script[type="application/ld+json"]');
    
    if (!scriptElement) {
      scriptElement = document.createElement("script");
      scriptElement.setAttribute("type", "application/ld+json");
      document.head.appendChild(scriptElement);
    }
    
    scriptElement.textContent = JSON.stringify(structuredData);
  }, [title, description, keywords, ogImage, ogUrl, canonical]);

  return null;
}

