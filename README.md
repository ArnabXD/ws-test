```
I have been using react-query for a long time to handle async operations and jotai/zustand/context api for global states, In my current organization, they are also not a fan of redux so I was never forced to learn it, and as I myself disliked redux, I didn't pick it up either. So this test was really challenging to me due to time factor & I liked the learning process. Thanks :)

This is my first task with redux ecosystem. So things might not be perfect. 
```

### Firestore rules

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && request.auth.uid == resource.data.author;
      allow update: if request.auth != null && request.auth.uid == resource.data.author && request.resource.data.author == resource.data.author;
      allow delete: if request.auth != null && resource.data.author == request.auth.uid
    }
  }
}
```