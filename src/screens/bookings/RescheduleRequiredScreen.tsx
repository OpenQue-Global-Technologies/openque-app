import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { BookingsStackParamList, MainTabParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryLink from '../../components/SecondaryLink';
import { Body, Caption, Heading, SubHeading } from '../../components/Typography';
import { getDoctorById, getHospitalById } from '../../data/mockData';
import { getBookingById, rescheduleBooking, type Booking } from '../../state/bookingsStore';
import { resolveRescheduleAlternatives, type AlternativeSlot } from '../../state/rescheduleAlgorithm';
import { dispatchRescheduleNotification, makeClaimToken, type DeliveryLogEntry } from '../../state/notificationDispatch';
import { colors, radius, spacing } from '../../theme/tokens';

type Props = CompositeScreenProps<
  NativeStackScreenProps<BookingsStackParamList, 'RescheduleRequired'>,
  BottomTabScreenProps<MainTabParamList>
>;

const CHANNEL_ICONS: Record<DeliveryLogEntry['channel'], keyof typeof Ionicons.glyphMap> = {
  Push: 'notifications-outline',
  WhatsApp: 'logo-whatsapp',
  SMS: 'chatbox-ellipses-outline',
};

export default function RescheduleRequiredScreen({ navigation, route }: Props) {
  const { bookingId, scenario, forceExhausted } = route.params;
  const [booking, setBooking] = useState<Booking | null | undefined>(undefined);
  const [deliveryLog, setDeliveryLog] = useState<DeliveryLogEntry[]>([]);
  const [isConfirming, setIsConfirming] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    getBookingById(bookingId).then((result) => {
      if (!isActive) return;
      setBooking(result);
      if (result) {
        const doctor = getDoctorById(result.doctorId);
        setDeliveryLog(dispatchRescheduleNotification(doctor?.name ?? 'your doctor', makeClaimToken()));
      }
    });
    return () => {
      isActive = false;
    };
  }, [bookingId]);

  if (booking === undefined) {
    return <ScreenContainer centered>{null}</ScreenContainer>;
  }
  if (!booking) {
    return (
      <ScreenContainer centered>
        <Body>Booking not found.</Body>
      </ScreenContainer>
    );
  }

  const doctor = getDoctorById(booking.doctorId);
  const hospital = getHospitalById(booking.hospitalId);
  const { alternatives, exhausted } = resolveRescheduleAlternatives(
    booking.doctorId,
    booking.date,
    booking.time,
    scenario,
    forceExhausted,
  );
  const formattedOriginalDate = new Date(booking.date).toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const handleSelectSlot = async (slot: AlternativeSlot) => {
    const key = `${slot.date}-${slot.time}`;
    setIsConfirming(key);
    await rescheduleBooking(bookingId, slot);
    setIsConfirming(null);
    navigation.navigate('RescheduleRequiredConfirmed', { bookingId, date: slot.date, time: slot.time });
  };

  const handleViewFullCalendar = () => {
    navigation.navigate('RescheduleCalendar', { bookingId, doctorId: booking.doctorId });
  };

  const handleChooseAlternativeDoctor = () => {
    if (!doctor) return;
    navigation.navigate('HomeTab', {
      screen: 'SearchResults',
      params: { initialSpecialty: doctor.specialty },
    });
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.iconCircle}>
          <Ionicons name="calendar-outline" size={40} color={colors.primary} />
        </View>
        <Heading style={styles.heading}>
          {doctor?.name ?? 'Your doctor'} is unavailable on {formattedOriginalDate}.
        </Heading>
        <Body style={styles.body}>Please choose a new time that works for you.</Body>

        <Card style={styles.logCard}>
          <Caption style={styles.logTitle}>Delivery channel log (dev-visible — item 39)</Caption>
          {deliveryLog.map((entry, index) => (
            <View key={index} style={styles.logRow}>
              <Ionicons name={CHANNEL_ICONS[entry.channel]} size={16} color={colors.neutralMuted} />
              <Caption style={styles.logText}>
                [{entry.channel}] {entry.message}
              </Caption>
            </View>
          ))}
        </Card>

        {exhausted ? (
          <View style={styles.exhaustedBlock}>
            <Caption style={styles.exhaustedText}>
              No alternative slots available with {doctor?.name ?? 'this doctor'} within the next 7 days.
            </Caption>
            <PrimaryButton label="View full calendar" onPress={handleViewFullCalendar} />
            <SecondaryLink
              label="Choose an alternative doctor in the same department"
              onPress={handleChooseAlternativeDoctor}
            />
          </View>
        ) : (
          <View style={styles.slotsBlock}>
            {alternatives.map((slot) => {
              const key = `${slot.date}-${slot.time}`;
              const formatted = new Date(slot.date).toLocaleDateString(undefined, {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              });
              return (
                <Card key={key} style={styles.slotCard}>
                  <View style={styles.slotInfo}>
                    <SubHeading style={styles.slotDate}>{formatted}</SubHeading>
                    <Caption>{slot.time}</Caption>
                  </View>
                  <PrimaryButton
                    label="Select this slot"
                    onPress={() => handleSelectSlot(slot)}
                    loading={isConfirming === key}
                  />
                </Card>
              );
            })}
            <SecondaryLink
              label="None of these work for me"
              onPress={() => navigation.navigate('Waitlist', { bookingId, doctorId: booking.doctorId })}
            />
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    gap: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  heading: {
    textAlign: 'center',
    fontSize: 20,
  },
  body: {
    textAlign: 'center',
    color: colors.neutralMuted,
  },
  logCard: {
    gap: spacing.xs,
    backgroundColor: colors.accent,
  },
  logTitle: {
    fontWeight: '700',
    color: colors.neutralDark,
    marginBottom: spacing.xs,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  logText: {
    flex: 1,
    color: colors.neutralDark,
  },
  slotsBlock: {
    gap: spacing.md,
    alignItems: 'center',
  },
  slotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: spacing.md,
  },
  slotInfo: {
    gap: 2,
  },
  slotDate: {
    fontSize: 16,
  },
  exhaustedBlock: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.lg,
  },
  exhaustedText: {
    textAlign: 'center',
    color: colors.neutralMuted,
    backgroundColor: colors.delayed.bg,
    padding: spacing.md,
    borderRadius: radius.medium,
  },
});
