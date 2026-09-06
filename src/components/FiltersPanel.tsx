import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Slider from '@react-native-community/slider';
import Chip from './Chip';
import PrimaryButton from './PrimaryButton';
import SecondaryLink from './SecondaryLink';
import { Body, Caption, SubHeading } from './Typography';
import SegmentedControl from './SegmentedControl';
import { SPECIALTIES, type Specialty } from '../data/mockData';
import { colors, radius, spacing } from '../theme/tokens';

export type AvailabilityOption = 'Today' | 'This week';

export type SearchFilters = {
  specialties: Specialty[];
  maxDistanceKm: number;
  minFee: number;
  maxFee: number;
  availability: AvailabilityOption;
};

export const DEFAULT_FILTERS: SearchFilters = {
  specialties: [],
  maxDistanceKm: 10,
  minFee: 0,
  maxFee: 1500,
  availability: 'Today',
};

type Props = {
  visible: boolean;
  initialFilters: SearchFilters;
  onApply: (filters: SearchFilters) => void;
  onClose: () => void;
};

export default function FiltersPanel({ visible, initialFilters, onApply, onClose }: Props) {
  const [draft, setDraft] = useState<SearchFilters>(initialFilters);

  const toggleSpecialty = (specialty: Specialty) => {
    setDraft((current) => ({
      ...current,
      specialties: current.specialties.includes(specialty)
        ? current.specialties.filter((item) => item !== specialty)
        : [...current.specialties, specialty],
    }));
  };

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  const handleReset = () => {
    setDraft(DEFAULT_FILTERS);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
        <View style={styles.grabber} />

        <SubHeading>Filters</SubHeading>

        <View style={styles.section}>
          <Body style={styles.sectionLabel}>Specialty</Body>
          <View style={styles.chipWrap}>
            {SPECIALTIES.map((specialty) => (
              <Chip
                key={specialty}
                label={specialty}
                selected={draft.specialties.includes(specialty)}
                onPress={() => toggleSpecialty(specialty)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Body style={styles.sectionLabel}>Distance — up to {draft.maxDistanceKm} km</Body>
          <Slider
            minimumValue={1}
            maximumValue={20}
            step={1}
            value={draft.maxDistanceKm}
            onValueChange={(value) => setDraft((current) => ({ ...current, maxDistanceKm: value }))}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.accent}
            thumbTintColor={colors.primary}
          />
        </View>

        <View style={styles.section}>
          <Body style={styles.sectionLabel}>
            Fee range — ₹{draft.minFee} to ₹{draft.maxFee}
          </Body>
          <Caption>Min fee</Caption>
          <Slider
            minimumValue={0}
            maximumValue={1500}
            step={50}
            value={draft.minFee}
            onValueChange={(value) =>
              setDraft((current) => ({ ...current, minFee: Math.min(value, current.maxFee) }))
            }
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.accent}
            thumbTintColor={colors.primary}
          />
          <Caption>Max fee</Caption>
          <Slider
            minimumValue={0}
            maximumValue={1500}
            step={50}
            value={draft.maxFee}
            onValueChange={(value) =>
              setDraft((current) => ({ ...current, maxFee: Math.max(value, current.minFee) }))
            }
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.accent}
            thumbTintColor={colors.primary}
          />
        </View>

        <View style={styles.section}>
          <Body style={styles.sectionLabel}>Availability</Body>
          <SegmentedControl
            options={['Today', 'This week']}
            value={draft.availability}
            onChange={(value) =>
              setDraft((current) => ({ ...current, availability: value as AvailabilityOption }))
            }
          />
        </View>

        <View style={styles.actions}>
          <PrimaryButton label="Apply filters" onPress={handleApply} />
          <SecondaryLink label="Reset all" onPress={handleReset} />
        </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(31, 41, 55, 0.4)',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.large,
    borderTopRightRadius: radius.large,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
    maxHeight: '85%',
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.neutralMuted,
    marginBottom: spacing.sm,
  },
  section: {
    gap: spacing.sm,
  },
  sectionLabel: {
    fontSize: 14,
    color: colors.neutralMuted,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actions: {
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
});
