# moode-meter

## Create Firebase Project

Cloud Firestore, Hosting
<https://firebase.google.com/>

### Firebase setup

```bash
npm install -g firebase-tools
firebase login
firebase init
<select cloud firestore & hosting>
```

### Create & modify firebase.js

```bash
cp src/plugins/firebase_samples.js src/plugins/firebase.js
```

edit src/plugins/firebase.js

## Project setup

```bash
npm install
```

### Compiles and hot-reloads for development

```bash
npm run serve
```

### Compiles and minifies for production

```bash
npm run build
```

### Lints and fixes files

```bash
npm run lint
```

### deploy Firebase hosting

```base
firebase deploy --only hosting:XXXX
```

*XXXX* is firebase hosting project.

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
