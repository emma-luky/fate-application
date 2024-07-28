import { Alert, View } from 'react-native';
import { Bookmark } from '@tamagui/lucide-icons';
import { QueryDocumentSnapshot } from 'firebase/firestore/lite';
import { Button, H5, Paragraph, XStack, YStack } from 'tamagui';
import { Filters } from './Filters';

type Props = {
  post: QueryDocumentSnapshot;
};

export function RecipeView(props: Props) {
  const post = props.post;

  return (
    <YStack gap={10}>
      <View key={post.id}>
        <H5>{post.data().title}</H5>
        <Paragraph>{post.data().author}</Paragraph>
        <Paragraph>{post.data().caption}</Paragraph>
        <Filters post={post}></Filters>
        <XStack gap={20}>
          <Button
            p={0}
            chromeless
            onPress={() => {
              Alert.alert('saved');
            }}
          >
            <Bookmark />
          </Button>
        </XStack>
      </View>
    </YStack>
  );
}