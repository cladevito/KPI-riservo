# Riservo — KPI Vendita

Piccola web app per registrare ogni chiamata a freddo (studio, esito, demo
fissata, da richiamare...) e vedere in tempo reale i KPI del "Gate A"
(15-20 chiamate → 5-6 titolari raggiunti → 1-2 Verdi) descritti nel
playbook di vendita.

Non serve installare nulla sul telefono: è un sito che apri dal browser,
sia da computer che da telefono, e i dati restano salvati per sempre in un
database — anche se cambi dispositivo.

---

## 1. Cosa devi fare (in breve)

1. Mettere questo codice su GitHub (una volta sola).
2. Collegare GitHub a Vercel e fare il deploy (5 minuti).
3. Aggiungere un database dal pannello di Vercel (2 click, gratis).
4. (Consigliato) Impostare una password per proteggere i tuoi dati commerciali.

Non devi scrivere nemmeno una riga di codice. Segui i passi qui sotto in
ordine.

---

## 2. Metti il codice su GitHub

Se non hai un account GitHub, creane uno gratis su https://github.com/signup

**Opzione più semplice (dal browser, senza terminale):**

1. Vai su https://github.com/new
2. Nome repository: `riservo-kpi` → Create repository (lascialo "Private" se vuoi tenerlo riservato)
3. Nella pagina del nuovo repository, clicca **"uploading an existing file"**
4. Trascina dentro **tutti i file e le cartelle** di questo progetto (tranne `node_modules` e `.next`, che non devono esistere qui)
5. Scrivi un messaggio tipo "Primo caricamento" e clicca **Commit changes**

Se invece tu o Giorgio preferite usare il terminale:

```bash
cd riservo-kpi
git init
git add .
git commit -m "Primo caricamento"
git branch -M main
git remote add origin https://github.com/TUO-USERNAME/riservo-kpi.git
git push -u origin main
```

---

## 3. Collega il progetto a Vercel

1. Vai su https://vercel.com/signup e crea un account **usando "Continue with GitHub"** (così è già collegato)
2. Nella dashboard di Vercel clicca **Add New → Project**
3. Trova il repository `riservo-kpi` nella lista e clicca **Import**
4. Vercel riconosce automaticamente che è un progetto Next.js: non cambiare nessuna impostazione, clicca direttamente **Deploy**
5. Aspetta 1-2 minuti: alla fine ti dà un link tipo `riservo-kpi.vercel.app` — è già online, ma non funziona ancora perché manca il database (prossimo passo)

---

## 4. Aggiungi il database (2 click, piano gratuito)

1. Apri il tuo progetto nella dashboard di Vercel
2. Vai sulla tab **Storage**
3. Clicca **Create Database** → scegli **Neon (Postgres)** (o "Postgres" se te lo propone direttamente — è lo stesso servizio)
4. Segui la procedura guidata, lasciando le opzioni di default
5. Nell'ultimo step, quando ti chiede a quale progetto collegarlo, scegli **riservo-kpi** e conferma per tutti gli ambienti (Production, Preview, Development)
6. Vercel imposta da solo la variabile `DATABASE_URL`: non devi copiare né incollare nessuna stringa a mano

Poi vai sulla tab **Deployments**, apri i tre puntini (`...`) sull'ultimo
deploy e scegli **Redeploy**, per far ripartire il sito con il database
collegato.

Da questo momento, aprendo il sito, la tabella dei dati viene creata in
automatico al primo caricamento: non devi fare nient'altro.

---

## 5. (Consigliato) Proteggi il sito con una password

Il sito contiene i nomi degli studi che chiami e le note delle chiamate:
meglio non lasciarlo aperto a chiunque abbia il link.

1. Nel progetto Vercel vai su **Settings → Environment Variables**
2. Aggiungi due variabili:
   - `AUTH_USER` → es. `clara`
   - `AUTH_PASS` → una password a tua scelta
3. Salvale per tutti gli ambienti, poi rifai **Redeploy** (come al punto 4)

Da ora, aprendo il sito il browser chiederà nome utente e password — quelli
che hai appena scelto. Se non imposti queste due variabili, il sito resta
raggiungibile da chiunque abbia il link, senza password.

---

## 6. Come si usa il sito

- **+ Nuova chiamata** in alto a destra → apre il modulo per registrare una chiamata appena fatta (studio, città, contatto, esito, eventuale data demo o data da richiamare, note)
- In alto vedi il riquadro **Gate A** con l'avanzamento verso l'obiettivo del round (chiamate fatte, titolari raggiunti, Verdi)
- Sotto, 4 numeri chiave: chiamate totali, tasso di Verde, demo in calendario, chiamate da richiamare oggi
- Il grafico mostra le chiamate fatte settimana per settimana
- In basso, l'elenco di tutte le chiamate: puoi filtrare per esito, cercare per nome studio/città, modificare o eliminare una riga

Tutto quello che inserisci resta salvato nel database — puoi chiudere il
sito e riaprirlo da un altro telefono, i dati sono sempre lì.

---

## 7. Costi

Con il traffico di un singolo utente che registra qualche chiamata al
giorno, resti comodamente dentro il piano gratuito sia di Vercel che di
Neon. Se in futuro il progetto cresce (più utenti, molti più dati), Vercel
ti avviserebbe prima di qualunque addebito.

---

## 8. Sviluppo in locale (solo per Giorgio, se vuole modificare il codice)

```bash
npm install
cp .env.example .env.local
# incolla in .env.local la stringa DATABASE_URL presa da Vercel → Storage → .env.local tab
npm run dev
```

Poi apri http://localhost:3000

## Struttura del progetto

```
app/
  page.tsx              → la dashboard (client component)
  api/calls/route.ts     → elenco e creazione chiamate
  api/calls/[id]/route.ts→ modifica ed eliminazione di una chiamata
components/               → pezzi di interfaccia (form, tabella, grafico, KPI)
lib/db.ts                 → connessione al database e creazione tabella
lib/stats.ts               → calcolo dei KPI dai dati grezzi
middleware.ts              → protezione opzionale con password
```
