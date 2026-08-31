# Fiber Splice Locator Mobile

Aplicativo Expo/React Native integrado ao backend Spring Boot.

## Executar

```bash
npm install
npx expo start
```

Use `a` para Android ou `i` para iOS no terminal do Expo.

## Configurar a API

Edite `config/api.js` conforme o ambiente:

- Emulador Android: `http://10.0.2.2:8080`
- Simulador iOS: `http://localhost:8080`
- Dispositivo físico: `http://IP_DO_COMPUTADOR:8080`

## Estrutura do projeto

```
theme/         cores, espaçamento, tipografia e sombra — a única fonte de
               valores visuais do app. Mudar uma cor aqui reflete em todas
               as telas que a usam.
components/ui/ kit de componentes de interface reutilizáveis (Screen,
               HeroHeader, PageHeader, Button, Card, SectionCard,
               TextField, SelectField, Chip, InfoRow, EmptyState,
               LoadingView, ErrorBanner). Toda tela é montada com essas
               peças em vez de recriar estilo próprio.
components/    componentes específicos do domínio (StatusBadge,
               ServiceOrderCard, CameraCapture).
utils/         helpers puros de formatação e leitura de dados da API
               (format.js, serviceOrder.js), sem duplicação entre telas.
screens/       uma tela por arquivo, montada a partir do theme + kit de UI.
services/      chamadas HTTP (axios) por domínio (auth, ceo, service order,
               fotos, localização) e o armazenamento do token.
contexts/      estado de autenticação (AuthContext).
config/        URL base da API e mapa de rotas do backend.
```

### Para mudar o visual do app

Edite os arquivos em `theme/` — não hexadecimais soltos nas telas.

### Para adicionar uma tela nova

Componha com `Screen` + (`HeroHeader` ou `PageHeader`) + `SectionCard` para
manter o mesmo espaçamento, cores e cabeçalho das demais telas.

## Contrato da API

- ID da ordem: `serviceOrderId`
- BoxNumber: `ceo.boxNumber`
- Descrição: `ceo.notes`
- Address: `ceo.address.street`, `ceo.address.streetNumber` e `ceo.address.city`
- Status: `status`
- Geolocation: `ceo.address.geoLocation` (ou `geolocation`/`coordinates`), além de `latitude`/`longitude` e `lat`/`lng`/`lon` como compatibilidade
- Fotos: `serviceOrderPhotos` e os endpoints de consulta/envio

A geolocalização não é inventada: quando as coordenadas não vierem no retorno, a tela mostra "Não disponível".

## Endpoints

`POST /api/auth/v1/login`, `GET /api/service_orders/v1`, `GET /api/service_orders/v1/id/{id}`, `PUT /api/ceo/v1/id/{id}`, `GET /api/service_order_photos/v1/service-order/{serviceOrderId}` e `POST /api/service_order_photos/v1/service-order/{serviceOrderId}` com multipart no campo `file`.
