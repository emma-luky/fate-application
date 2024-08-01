import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  DocumentSnapshot,
  getDoc,
  getDocs,
  QueryDocumentSnapshot,
} from 'firebase/firestore/lite';
import { YStack } from 'tamagui';
import { router } from 'expo-router';
import { db } from '../support/firebase';
import { RecipeView } from './RecipeView';
import { getAuth } from 'firebase/auth';

export function RecipeListView() {
  const [recipes, setRecipes] = useState<QueryDocumentSnapshot[]>([]);
  const [user, setUser] = useState<DocumentSnapshot>();

  // for when the page loads
  useEffect(() => {
    const getUser = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if(currentUser){
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        setUser(userDocSnap);
      }
      else{
        console.log('No user signed in');
      }
    }
    void getUser();
    const getPosts = async () => {
      const postsRef = collection(db, 'recipes');
      const postsSnapshot = await getDocs(postsRef);
      setRecipes(postsSnapshot.docs);
    };
    void getPosts();
  }, []);
  
  return (
    // will change the route to recipe page.
    <YStack onPress={() => {router.navigate("/");}} gap={10} margin={10}>
      {recipes.map((recipe) => (
        <RecipeView key={recipe.id} recipe={recipe} user={user} />
      ))}
    </YStack>
  );
}