# Phase 4 API Contract

> **Base URL**: `http://localhost:4000`
> **Note**: Authentication is not implemented yet. The `userId` property is currently passed directly in the payload or query parameters where necessary. This is temporary until Phase 6 Auth.

## Health
### `GET /health`
Returns the operational status of the service and timestamp.
**Response**: `200 OK`
```json
{
  "ok": true,
  "ts": "2026-02-28T16:10:00.686Z"
}
```

---

## Pins
### `GET /pins`
Retrieves a cursor-paginated feed of Pins. Offers stable ordering via `createdAt + id`.

**Query Parameters**
- `limit` (number, optional, max 50, default 20)
- `cursor` (string, optional, base64 encoded cursor from previous response)

**Response**: `200 OK`
```json
{
  "items": [
    {
      "id": "c916017b-ffdc-4e79-8958-a82bf3b65807",
      "title": "UI Cards",
      "description": null,
      "tags": [],
      "category": null,
      "sourceUrl": "https://example.com/a",
      "canonicalUrl": "https://example.com/a",
      "domain": "example.com",
      "imageUrl": "https://picsum.photos/seed/a/600/800",
      "imageWidth": null,
      "imageHeight": null,
      "attributionText": null,
      "userId": "9ccb74ab-e368-404d-9f43-64def1c2ef4b",
      "boardId": null,
      "createdAt": "2026-02-28T15:51:10.912Z",
      "updatedAt": "2026-02-28T15:51:10.912Z"
    }
  ],
  "nextCursor": "<base64CursorString>"
}
```

### `POST /pins`
Creates a single pin in the database. 
**Request Body**
```json
{
  "title": "Minimal Arch",
  "sourceUrl": "https://arch.com/minimal",
  "canonicalUrl": "https://arch.com/minimal",
  "domain": "arch.com",
  "imageUrl": "https://media.arch.com/minimal.jpg",
  "userId": "9ccb74ab-e368-404d-9f43-64def1c2ef4b",
  "tags": ["architecture", "minimalism"]
}
```

**Response**: `201 Created`
*(Returns Pin object)*

### `GET /pins/:id`
Retrieves an individual pin by unique ID.
**Response**: `200 OK` *(Returns Pin object)* | `404 Not Found`

### `PATCH /pins/:id`
Partially updates an existing pin.
**Request Body**
```json
{
  "title": "Updated Minimal Arch"
}
```
**Response**: `200 OK` | `404 Not Found`

### `DELETE /pins/:id`
Removes a pin from the database.
**Response**: `204 No Content` | `404 Not Found`

---

## Boards

### `POST /boards`
Creates a new board container.
**Request Body**
```json
{
  "name": "Design Resources",
  "userId": "9ccb74ab-e368-404d-9f43-64def1c2ef4b"
}
```
**Response**: `201 Created`
```json
{
  "id": "832de3a0-cf41-4c03-ae8e-6b92b2ecb8c5",
  "name": "Design Resources",
  "userId": "9ccb74ab-e368-404d-9f43-64def1c2ef4b",
  "createdAt": "2026-02-28T16:15:00.000Z",
  "updatedAt": "2026-02-28T16:15:00.000Z"
}
```

### `GET /boards`
Retrieves an array of boards. Can be filtered by owner context.

**Query Parameters**
- `userId` (string, optional, UUID filter)

**Response**: `200 OK`
```json
[
  {
    "id": "832de3a0-cf41-4c03-ae8e-6b92b2ecb8c5",
    "name": "Design Resources",
    "userId": "9ccb74ab-e368-404d-9f43-64def1c2ef4b",
    "createdAt": "2026-02-28T16:15:00.000Z",
    "updatedAt": "2026-02-28T16:15:00.000Z"
  }
]
```

### `GET /boards/:id`
Retrieves an individual board by unique ID.
**Response**: `200 OK` | `404 Not Found`

### `PATCH /boards/:id`
Updates the name of a board.
**Request Body**
```json
{
  "name": "Master UI Concept"
}
```
**Response**: `200 OK` | `404 Not Found`

### `DELETE /boards/:id`
Deletes a board and gracefully detaches related pinned items (`boardId` becomes null on related `Pin` rows).
**Response**: `204 No Content` | `404 Not Found`

### `POST /boards/:id/pins/:pinId`
Assigns an existing pin to this board layout.
**Response**: `200 OK` *(Returns Pin object with newly mapped boardId)* | `404 Not Found`

### `DELETE /boards/:id/pins/:pinId`
Unassigns an existing pin from this board layout.
**Response**: `204 No Content` | `404 Not Found` | `409 Conflict` *(If pin was not assigned to this board)*
