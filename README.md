# Ce să mai implementăm

Eu vreau să mai fac din chestiile mărunte în primul rând:

- [x] user is typing
- [x] de combinat mesaje
- [x] randare mai bună de twemoji
- [x] tag numai la userii din chat
- [x] tag prin tab
- [x] inline markdown: `http(s)://` links
- [x] inline markdown: latex `$`
- [x] de afișat userii dintr-un chat
- [x] de scos id-ul din caseta cu chatul
- [x] background la casetele cu mesaje diferit de backgroundul paginii
- [x] de schimbat faviconul

## 📸 Poze

Încărcăm poza în Storage. Se triggăruiește o funcție cloud. Aceasta optimizează imaginea (cu **Image Processing API**) și îi generează descrierea (cu **Label Images with Cloud Vision AI**) pe care o stochează în Firestore. Pozele trimise într-un chat vor fi un tip special de mesaj în Firestore (un obiect cu câmpurile `fileName` și `imageDescription`).

## 🤖 Boți

Facem o pagină `/bots` pentru userii logați. Aceasta o să conțină numărul de tokeni (aici intervine ideea de la Fireship), inițial 10 sau ceva de test. Putem re(genera) o cheie de API și putem crea sau șterge boți, câte unul pentru fiecare chat din care facem parte și noi. Expunem API-ul (nu tocmai cum era și în documentație, adică acum avem nevoie doar de ruta `/api/message`, nu și de `/api/create`). Evident, când trimitem un request o să trimitem și cheia API, iar serverul va verifica și faptul că avem suficienți tokeni (1 per mesaj). Putem cumpăra tokeni (câte 100 la 1$) folosind un cont de test Stripe (cu **Run Payments with Stripe**).

---

**Notă.** Toate chestiile cu bold sunt extensii Firebase, care ne ajută să lucrăm mai ușor cu serviciile respective (ca Algolia sau Stripe, care nu țin de Google). N-am mai folosit, vedem acum care-i treaba.
