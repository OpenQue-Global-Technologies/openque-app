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
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryLink from '../../components/SecondaryLink';
import Toast from '../../components/Toast';
import DevPanel from '../../components/DevPanel';
import QueuePositionCard from '../../components/QueuePositionCard';
import { HOSPITALS, SPECIALTIES, getDoctorById, getHospitalById } from '../../data/mockData';
import { colors, spacing } from '../../theme/tokens';
import { getAllBookings, getUpcomingBooking, type Booking } from '../../state/bookingsStore';
import { getAheadCount, getPatientFacingStatus, getQueueState, type QueueState } from '../../state/queueStore';
import { getIsAreaAvailable, setIsAreaAvailable } from '../../state/areaAvailabilityStore';
import { addAreaNotifyRequest, dispatchAreaAvailable } from '../../state/notifyRequestsStore';

const ACTIVE_QUEUE_STATES: QueueState[] = ['WAITING', 'CALLED', 'IN_CONSULTATION', 'REFERRED', 'RETURNING'];
const DEMO_AREA = 'Anna Nagar, Chennai';
const TOAST_DURATION_MS = 2500;

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'HomeFeed'>,
  BottomTabScreenProps<MainTabParamList>
>;

export default function HomeFeedScreen({ navigation }: Props) {
  const [upcomingBooking, setUpcomingBooking] = useState<Booking | null>(null);
  const [hasEverBooked, setHasEverBooked] = useState(true);
  const [queueState, setQueueStateLocal] = useState<QueueState>('BOOKED');
  const [aheadCount, setAheadCountLocal] = useState(0);
  const [isAreaAvailable, setIsAreaAvailableLocal] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      setIsAreaAvailableLocal(getIsAreaAvailable());
      Promise.all([getUpcomingBooking(), getAllBookings()]).then(async ([booking, allBookings]) => {
        if (!isActive) return;
        setUpcomingBooking(booking);
        setHasEverBooked(allBookings.length > 0);
        if (booking) {
          const state = await getQueueState(booking.id);
          const ahead = await getAheadCount(booking.id);
          if (isActive) {
            setQueueStateLocal(state);
            setAheadCountLocal(ahead);
          }
        }
      });
      return () => {
        isActive = false;
      };
    }, []),
  );

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), TOAST_DURATION_MS);
  };

  const isQueueActive = ACTIVE_QUEUE_STATES.includes(queueState);

  const goToSearch = () => navigation.navigate('SearchResults', undefined);

  const goToSearchWithSpecialty = (specialty: (typeof SPECIALTIES)[number]) => {
    navigation.navigate('SearchResults', { initialSpecialty: specialty });
  };

  const goToPastAppointments = () => {
    navigation.navigate('BookingsTab', { screen: 'BookingsList', params: { initialTab: 'Past' } });
  };

  const handleNotifyWhenAvailable = () => {
    addAreaNotifyRequest(DEMO_AREA);
    showToast(`We'll notify you when OpenQue launches in ${DEMO_AREA}.`);
  };

  const handleDevToggleArea = () => {
    const next = !isAreaAvailable;
    setIsAreaAvailable(next);
    setIsAreaAvailableLocal(next);
    if (next) {
      const notified = dispatchAreaAvailable(DEMO_AREA);
      showToast(
        notified.length > 0
          ? `Simulated dispatch: notified ${notified.length} pending request(s) for ${DEMO_AREA}.`
          : 'Area marked available (no pending notify requests to dispatch).',
      );
    }
  };

  const upcomingDoctor = upcomingBooking ? getDoctorById(upcomingBooking.doctorId) : undefined;
  const upcomingHospital = upcomingBooking ? getHospitalById(upcomingBooking.hospitalId) : undefined;

  if (!isAreaAvailable) {
    return (
      <ScreenContainer centered>
        <Toast visible={!!toastMessage} message={toastMessage ?? ''} />
        <Ionicons name="location-outline" size={48} color={colors.neutralMuted} />
        <Heading style={styles.emptyHeading}>OpenQue isn&apos;t in your area yet.</Heading>
        <Body style={styles.emptyBody}>
          We&apos;re expanding fast — we&apos;ll notify you the moment we launch near you.
        </Body>
        <View style={styles.emptyActions}>
          <PrimaryButton label="Notify me when available" onPress={handleNotifyWhenAvailable} />
          <SecondaryLink label="Search a different area" onPress={goToSearch} />
        </View>
        <View style={styles.devSection}>
          <DevPanel
            title="area availability simulation"
            actions={[{ label: 'Simulate: Area now available', onPress: handleDevToggleArea }]}
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.noHorizontalPadding}>
      <Toast visible={!!toastMessage} message={toastMessage ?? ''} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Caption style={styles.locationLabel}>
            <Ionicons name="location-sharp" size={14} color={colors.primary} /> {DEMO_AREA}
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

        <View style={styles.section}>
          <SubHeading>Your Upcoming Appointment</SubHeading>
          {upcomingBooking && upcomingDoctor && upcomingHospital ? (
            isQueueActive ? (
              <QueuePositionCard
                doctorName={upcomingDoctor.name}
                statusText={getPatientFacingStatus(aheadCount, queueState)}
                onPress={() => navigation.navigate('QueueTab')}
              />
            ) : (
              <Card onPress={() => navigation.navigate('BookingsTab')} style={styles.appointmentCard}>
                <Body>{upcomingDoctor.name}</Body>
                <Caption>{upcomingHospital.name}</Caption>
                <Caption style={styles.appointmentTime}>
                  {upcomingBooking.date} · {upcomingBooking.time}
                </Caption>
              </Card>
            )
          ) : hasEverBooked ? (
            <Card style={styles.noAppointmentCard}>
              <Ionicons name="calendar-outline" size={32} color={colors.neutralMuted} />
              <Body style={styles.noAppointmentText}>You have no appointments.</Body>
              <View style={styles.noAppointmentActions}>
                <PrimaryButton label="Book now" onPress={goToSearch} />
                <SecondaryLink label="View past appointments" onPress={goToPastAppointments} />
              </View>
            </Card>
          ) : (
            <Card style={styles.noAppointmentCard}>
              <Ionicons name="calendar-outline" size={32} color={colors.primary} />
              <Body style={styles.noAppointmentText}>Book your first appointment.</Body>
              <PrimaryButton label="Browse hospitals" onPress={goToSearch} />
            </Card>
          )}
        </View>

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

        <View style={styles.section}>
          <DevPanel
            title="area availability simulation"
            actions={[{ label: 'Simulate: Area not available', onPress: handleDevToggleArea }]}
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
  noAppointmentCard: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  noAppointmentText: {
    textAlign: 'center',
  },
  noAppointmentActions: {
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  hospitalRow: {
    gap: spacing.md,
  },
  emptyHeading: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: spacing.md,
  },
  emptyBody: {
    textAlign: 'center',
    color: colors.neutralMuted,
    marginTop: spacing.xs,
  },
  emptyActions: {
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xxl,
    width: '100%',
  },
  devSection: {
    marginTop: spacing.xxxl,
    width: '100%',
  },
});
