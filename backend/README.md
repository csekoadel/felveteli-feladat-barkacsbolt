Kérlek a src mappában lévő fájlokat ne módosítsd, akkor se, ha azok hibásan működnek. A fejlesztés backend része nem tartozik a feladathoz, és hibás esetben sajnos együtt kell élnünk ezzel a javításig.

Indítás
A backend server indítása egyszerűen az 'npm run start' paranccsal indíthatod el. Ez a localhost:3000 -es portján indít el egy kisebb előre konfigurált szervert, amelyben pár adat már megtalálható, de minden újraindításnál visszaáll az alaphelyzetre.

A mappában megtalálható az 'openapi.json' fájl, amelyet a 'https://editor.swagger.io/' oldalon megnyitva egy dokumentációt találsz a backendről.

Összesen 8 végpontot találsz:
GET /api/categories - ez visszaadja a barkácsüzlet által foglalkozott kategóriákat
GET /api/tool-names - ez visszaadja a barkácsüzlet által forgalmazott eszközök listáját
GET /api/tools/grouped - ez visszaadja az összes eszközt kategóriákban csoportosítva
GET /api/tools - ez adja vissza a raktári készletet
POST /api/tools - hozzáad a raktárhoz egy eszközből egy adott mennyiséget
DELETE /api/tools/{id} - töröl egy már elfogyott eszközt a raktárból
POST /api/tools/{id}/stock - egy raktáron lévő eszköz darabszámán növel
POST /api/purchases - ezzel lehet egy teljes bevásárló listát beküldeni, amely ha raktáron van elég mennyiség, akkor levonja azokat