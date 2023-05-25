# Ce să mai implementăm

Eu vreau să mai fac din chestiile mărunte în primul rând:

- [ ] user is typing
- [ ] edit message on double click
- [ ] better twemoji (without replacing)
- [ ] alphanumeric usernames (for better tags)
- [ ] tag only users in chat
- [ ] inline markdown - `http(s)://` links
- [ ] inline markdown - latex `$`
- [ ] de scos id-ul din caseta cu chatul
- [ ] background la casetele cu mesaje diferit de backgroundul paginii
- [ ] change favicon

## 📸 Poze

Încărcăm poza în Storage. Se triggăruiește o funcție cloud. Aceasta optimizează imaginea (cu **Image Processing API**) și îi generează descrierea (cu **Label Images with Cloud Vision AI**) pe care o stochează în Firestore. Pozele trimise într-un chat vor fi un tip special de mesaj în Firestore (un obiect cu câmpurile `imageUrl` și `imageDescription`).

## 🔎 Căutare

Fiecare chat o să aibă un buton de search. Acesta o să caute text printre mesaje (cu **Search Firestore with Algolia**), o să returneze (în UI) o listă cu mesajele respective și cu textul corespunzător din ele evidențiat. Dând click pe un mesaj anume vom fi duși la mesajul propriu-zis din chat:

```js
document.getElementById(messageId).scrollIntoView()
```

## 🤖 Boți

Facem o pagină `/bots` pentru userii logați. Aceasta o să conțină numărul de tokeni (aici intervine ideea furată de la Fireship), inițial 100 sau ceva de test. Putem re(genera) o cheie de API, putem crea sau șterge boți și putem adăuga boți la chaturi (din care facem parte și noi). Expunem API-ul (nu tocmai cum era și în documentație, adică acum avem nevoie doar de ruta `/api/message`, nu și de `/api/create`). Evident, când trimitem un request o să trimitem și cheia API, iar serverul va verifica și faptul că avem suficienți tokeni (1 per mesaj). Putem cumpăra tokeni (câte 100 la 1$) folosind un cont de test Stripe (cu **Run Payments with Stripe**).

---

**Notă.** Toate chestiile cu bold sunt extensii Firebase, care ne ajută să lucrăm mai ușor cu serviciile respective (ca Algolia sau Stripe, care nu țin de Google). N-am mai folosit, vedem acum care-i treaba.
