# External APIs

## WhatsApp Integration

- **Purpose:** Compartilhamento direto de links de eventos via WhatsApp
- **Documentation:** https://wa.me/ URL scheme
- **Base URL(s):** https://wa.me/
- **Authentication:** Não requerida (URL scheme público)
- **Rate Limits:** Nenhum conhecido

**Key Endpoints Used:**
- `GET https://wa.me/?text={message}` - Compartilhar mensagem no WhatsApp

**Integration Notes:** Uso de URL scheme padrão, sem necessidade de API key

## QR Code Generator

- **Purpose:** Gerar QR codes para facilitar compartilhamento de eventos
- **Documentation:** Browser Canvas API ou biblioteca simples
- **Base URL(s):** Local/Browser API
- **Authentication:** Não requerida
- **Rate Limits:** Limitado apenas por recursos do cliente

**Integration Notes:** Implementação client-side para reduzir carga no servidor
