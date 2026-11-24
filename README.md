Feladat:
Készíts egy egyszerűen alkalmazást, amit egy barkácsbolt eladója használhat, hogy rendszerezze az eszközök raktári készletét.

Használj:

nodeJS      -   v24.18.x
angular     -   v22


Fontos:
Ne használj semmilyen külső library-t a design megvalósításához, de legyen jól látható minden. Írj saját CSS-t!
Csak a src mappában, illetve a public/i18n alatt lévő hu és en.json fájlokban lehet módosításokat végezned, amennyiben azon kívül is szükséged van módosításra, azt ennek a fájlnak a végén jegyezd fel, hogy mit és miért módosítottál.
A src mappán belül kérlek ne használj Promise és any típusokat, legyen mindennek rendes típusa, és a Promise helyett használj más async megoldást.
Az applikáció standalone angularra épül (ng22) kérlek lehetőség szerint ne hozz benne létre module-okat.
Bár nem ellenőrizhető, de kiemelten szeretném, hogy ne használj AI segítséget kódgeneráláshoz! Kód értelmezéséhez (bár erre nincs szükséged a feladat során) vagy debugolás kapcsán hibafeltáráshoz viszont használhatsz, amennyiben már más eszközhöz nem tudsz nyúlni.

Az alkalmazás az adatokat a backend mappában lévő apró servicen keresztül szeretnénk használni. Annak pontos leírását a mappa README.md fájlja tartalmazza, kérlek figyelmesen olvasd el azt is.

A frontendnek tudnia kell a következő dolgokat:
- listázó oldal, ahol a felhasználó láthatja a raktáron lévő eszközöket.
- - ezen belül szükséges egy hozzáadó funkciót beépíteni, ahol növelni tudjuk a raktári készletet (x darabbal)
- - továbbá szükséges egy törlés gomb is amellyel eltávolíthatjuk az adott eszközt a raktári készletből
- - vásárlás funkció: akár egy teljes bevásárlólistát összeállíthatunk, amit a végén mint bevásárlás elküldünk a backendnek
- új eszköz hozzáadása oldal
- - itt fontos az, hogy a backendtől lekérjük az összes kategóriát, és kategóriánként kiírjuk  hogy milyen eszközök tartoznak oda. egyszerre csak egy új eszköz adható hozzá, a felhasználó egyszerűsége kedvéért szeretném, hogy először kategóriát választhasson, majd csak az ahoz tartozó eszközök listájából válasszon egyet, amelyből x darabot hozzáadhat a készlethez.

A két oldal között navigálni kell tudni. Egy új eszköz hozzáadása után nem kell egyből visszanavigálni a lista oldalhoz, hisz egy kamionnyi árut egymás után egyesével kell felvinnie a felhasználónak (egyelőre nem kell jobb megoldást kitalálni hozzá).
A listázó oldalon viszont kell egy a frontend által létrehozott filter. Ezzel legyen lehetőségünk kategóriára, vagy konkrét eszközre szűrni.

A backend a kategóriát és az eszközt egy-egy enum alapján adja vissza illetve tárolja el. Erre figyeljünk oda és a felhasználónak fordítsuk le magyar nyelvre, vagy angol nyelvre. Ezt lehessen állítani, hogy milyen nyelven akarjuk használni az alkalmazást. Használd hozzá az en.json illetve hu.json -t a public/i18n mappában. Ehhez a fájlokhoz szükség esetén hozzáadhatsz sorokat. A fordításhoz használd a package.json-ban előkészített ngx-translate librarykat amelynek kezdeti konfigurációja is rád vár. Ha ezt nem sikerül bekonfigurálnod (amely amúgy sem junior feladat), használd a "help" mappa alatti fájlokat, és ügyesen állítsd össze a kódot a benne található README.md fájl segítségével. Ha mégis sikerülne részben vagy egészben saját magad bekonfigurálni, abban az estben ezt a konfiguráció helyén komment formájában jelezd.

Szeretném hogy különösen figyelj oda arra, hogy egy fájlon belül csak egy dolog legyen. Minden model, komponens, service és az ezekhez szükséges helper fájlok is kapjanak dedikált helyet az alkalmazásodban, úgy hogy az logikus felépítésű, könnyen debugolható legyen.

A feladat elvégzése után átnézném az így létrejött kódod, és szeretném ha összeülnénk mint egy review, és megbeszélnénk, hogy mit hogyan és miért csináltál benne.

(utó-irat: tudom hogy a barkácsbolt témaválasztás nagyon fiús, de manapság felújítás miatt folyamat ilyenek járnak a fejemben. Bocsi miatta :D)

Amennyiben a fent leírt fájlokon kívül is módosítást kellett végezz, azokat kérlek ide vedd fel:

