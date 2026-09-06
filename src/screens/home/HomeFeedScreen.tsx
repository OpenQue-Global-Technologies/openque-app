import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type { HomeStackParamList, MainTabParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import { Body, Caption, Heading, SubHeading } from '../../components/Typography';
import PillTextInput from '../../components/PillTextInput';
import Chip from '../../components/Chip';
import HospitalCard from '../../components/HospitalCard';
import Card from '../../components/Card';
import { HOSPITALS, SPECIALTIES, getDoctorById, getHospitalById } from '../../data/mockData';
import { colors, spacing } from '../../theme/tokens';
import { getUpcomingBooking, type Booking } from '../../state/bookingsStore';

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'HomeFeed'>,
  BottomTabScreenProps<MainTabParamList>
>;

export default function HomeFeedScreen({ navigation }: Props) {
  const [upcomingBooking, setUpcomingBooking] = useState<Booking | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      getUpcomingBooking().then((booking) => {
        if (isActive) setUpcomingBooking(booking);
      });
      return () => {
        isActive = false;
      };
    }, []),
  );

  const goToSearch = () => navigation.navigate('SearchResults', undefined);

  const goToSearchWithSpecialty = (specialty: (typeof SPECIALTIES)[number]) => {
    navigation.navigate('SearchResults', { initialSpecialty: specialty });
  };

  const upcomingDoctor = upcomingBooking ? getDoctorById(upcomingBooking.doctorId) : undefined;
  const upcomingHospital = upcomingBooking ? getHospitalById(upcomingBooking.hospitalId) : undefined;

  return (
    <ScreenContainer style={styles.noHorizontalPadding}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Caption style={styles.locationLabel}>
            <Ionicons name="location-sharp" size={14} color={colors.primary} /> Anna Nagar, Chennai
          </Caption>
          <View style={styles.headerIcons}>
            <View style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={22} color={colors.neutralDark} />
            </View>
            <Pressable
              style={styles.iconButton}
              onPress={() => navigation.navigate('ProfileTab')}
              accessibilityRole="button"
              accessibilityLabel="Profile"
            >
              <Ionicons name="person-circle-outline" size={26} color={colors.neutralDark} />
            </Pressable>
          </View>
        </View>

        <Pressable onPress={goToSearch}>
          <View pointerEvents="none">
            <PillTextInput placeholder="Search hospitals, doctors, specialties" editable={false} />
          </View>
        </Pressable>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {SPECIALTIES.map((specialty) => (
            <Chip key={specialty} label={specialty} onPress={() => goToSearchWithSpecialty(specialty)} />
          ))}
        </ScrollView>

        {upcomingBooking && upcomingDoctor && upcomingHospital && (
          <View style={styles.section}>
            <SubHeading>Your Upcoming Appointment</SubHeading>
            <Card
              onPress={() => navigation.navigate('BookingsTab')}
              style={styles.appointmentCard}
            >
              <Body>{upcomingDoctor.name}</Body>
              <Caption>{upcomingHospital.name}</Caption>
              <Caption style={styles.appointmentTime}>
                {upcomingBooking.date} · {upcomingBooking.time}
              </Caption>
            </Card>
          </View>
        )}

        <View style={styles.section}>
          <SubHeading>Nearby Hospitals</SubHeading>
          <FlatList
            data={HOSPITALS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.hospitalRow}
            renderItem={({ item }) => (
              <HospitalCard
                hospital={item}
                onPress={() => navigation.navigate('HospitalProfile', { hospitalId: item.id })}
                onBookNow={() => navigation.navigate('HospitalProfile', { hospitalId: item.id })}
              />
            )}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  noHorizontalPadding: {
    paddingHorizontal: 0,
  },
  scrollContent: {
    paddingHorizontal: spacing.xxl,
    gap: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 44,
  },
  locationLabel: {
    fontSize: 14,
    color: colors.neutralDark,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipRow: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  section: {
    gap: spacing.md,
  },
  appointmentCard: {
    gap: 2,
  },
  appointmentTime: {
    color: colors.primary,
    marginTop: spacing.xs,
  },
  hospitalRow: {
    gap: spacing.md,
  },
});
