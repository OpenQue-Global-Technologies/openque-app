import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import { Heading } from '../../components/Typography';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryLink from '../../components/SecondaryLink';
import PaginationDots from '../../components/PaginationDots';
import { colors, spacing } from '../../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'WelcomeCarousel'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Slide = {
  key: string;
  heading: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const SLIDES: Slide[] = [
  { key: 'find', heading: 'Find the right doctor, fast.', icon: 'search' },
  { key: 'book', heading: 'Book appointments in seconds.', icon: 'calendar' },
  { key: 'queue', heading: 'Track your queue, live.', icon: 'time' },
];

export default function WelcomeCarouselScreen({ navigation }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList<Slide>>(null);

  const goToLogin = () => {
    navigation.navigate('Login', { entryPoint: 'carousel' });
  };

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  const isLastSlide = activeIndex === SLIDES.length - 1;

  return (
    <ScreenContainer style={styles.noHorizontalPadding}>
      <View style={styles.topRow}>
        {!isLastSlide ? (
          <SecondaryLink label="Skip" onPress={goToLogin} />
        ) : (
          <View style={styles.topRowSpacer} />
        )}
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
            <View style={styles.illustration}>
              <Ionicons name={item.icon} size={96} color={colors.primary} />
            </View>
            <Heading style={styles.heading}>{item.heading}</Heading>
          </View>
        )}
      />

      <View style={styles.footer}>
        <PaginationDots count={SLIDES.length} activeIndex={activeIndex} />
        {isLastSlide && (
          <View style={styles.continueButton}>
            <PrimaryButton label="Continue" onPress={goToLogin} />
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  noHorizontalPadding: {
    paddingHorizontal: 0,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.xxl,
    minHeight: 44,
  },
  topRowSpacer: {
    height: 44,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxxl,
    gap: spacing.xxxl,
  },
  illustration: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xl,
    gap: spacing.xxl,
  },
  continueButton: {
    marginTop: spacing.sm,
  },
});
