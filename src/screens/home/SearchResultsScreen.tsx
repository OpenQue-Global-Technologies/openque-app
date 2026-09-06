import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { HomeStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import BackButton from '../../components/BackButton';
import PillTextInput from '../../components/PillTextInput';
import Dropdown from '../../components/Dropdown';
import SearchResultCard from '../../components/SearchResultCard';
import PrimaryButton from '../../components/PrimaryButton';
import { Body, Caption, Heading } from '../../components/Typography';
import FiltersPanel, { DEFAULT_FILTERS, type SearchFilters } from '../../components/FiltersPanel';
import { HOSPITALS, getHospitalSearchMeta, type HospitalSearchMeta, type Hospital } from '../../data/mockData';
import { colors, spacing, touchTarget } from '../../theme/tokens';

type Props = NativeStackScreenProps<HomeStackParamList, 'SearchResults'>;

type SortOption = 'Distance' | 'Rating' | 'Fee';
const SORT_OPTIONS: SortOption[] = ['Distance', 'Rating', 'Fee'];

type ResultRow = { hospital: Hospital; meta: HospitalSearchMeta };

export default function SearchResultsScreen({ navigation, route }: Props) {
  const [query, setQuery] = useState(route.params?.initialQuery ?? '');
  const [filters, setFilters] = useState<SearchFilters>(() => ({
    ...DEFAULT_FILTERS,
    specialties: route.params?.initialSpecialty ? [route.params.initialSpecialty] : [],
  }));
  const [sortBy, setSortBy] = useState<SortOption>('Distance');
  const [isFiltersVisible, setFiltersVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

  const results = useMemo<ResultRow[]>(() => {
    const specialtyFilter = filters.specialties[0];

    const rows = HOSPITALS.filter((hospital) => {
      const matchesQuery =
        !query.trim() ||
        hospital.name.toLowerCase().includes(query.trim().toLowerCase()) ||
        hospital.specialties.some((specialty) =>
          specialty.toLowerCase().includes(query.trim().toLowerCase()),
        );
      const matchesSpecialty =
        filters.specialties.length === 0 ||
        filters.specialties.some((specialty) => hospital.specialties.includes(specialty));
      const matchesDistance = hospital.distanceKm <= filters.maxDistanceKm;
      return matchesQuery && matchesSpecialty && matchesDistance;
    })
      .map((hospital) => {
        const meta = getHospitalSearchMeta(hospital.id, specialtyFilter);
        return meta ? { hospital, meta } : null;
      })
      .filter((row): row is ResultRow => row !== null)
      .filter((row) => row.meta.startingFeeInr >= filters.minFee && row.meta.startingFeeInr <= filters.maxFee);

    const sorted = [...rows].sort((a, b) => {
      if (sortBy === 'Distance') return a.hospital.distanceKm - b.hospital.distanceKm;
      if (sortBy === 'Rating') return b.hospital.rating - a.hospital.rating;
      return a.meta.startingFeeInr - b.meta.startingFeeInr;
    });

    return sorted;
  }, [query, filters, sortBy]);

  const handleClearFilters = () => {
    setQuery('');
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <ScreenContainer style={styles.noHorizontalPadding}>
      <View style={styles.topBar}>
        <BackButton onPress={() => navigation.navigate('HomeFeed')} />
        <View style={styles.searchInputWrapper}>
          <PillTextInput
            placeholder="Search hospitals, doctors, specialties"
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>

      <View style={styles.controlsRow}>
        <View style={styles.viewToggle}>
          <Pressable
            style={[styles.viewToggleOption, viewMode === 'list' && styles.viewToggleOptionActive]}
            onPress={() => setViewMode('list')}
          >
            <Body style={viewMode === 'list' ? styles.viewToggleTextActive : styles.viewToggleText}>
              List
            </Body>
          </Pressable>
          <Pressable
            style={[styles.viewToggleOption, viewMode === 'map' && styles.viewToggleOptionActive]}
            onPress={() => setViewMode('map')}
          >
            <Body style={viewMode === 'map' ? styles.viewToggleTextActive : styles.viewToggleText}>
              Map
            </Body>
          </Pressable>
        </View>

        <Pressable
          style={styles.filterIconButton}
          onPress={() => setFiltersVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Open filters"
        >
          <Ionicons name="options-outline" size={20} color={colors.neutralDark} />
        </Pressable>

        <Dropdown label="Sort" value={sortBy} options={SORT_OPTIONS} onChange={setSortBy} />
      </View>

      {viewMode === 'map' ? (
        <View style={styles.mapContainer}>
          <View style={styles.mapCanvas}>
            <Caption style={styles.mapDisclaimer}>
              Illustrative placeholder — pins are positioned schematically, not on live map data.
            </Caption>
            {results.map((row, index) => {
              // Deterministic pseudo-scatter so pins don't overlap — closer
              // hospitals sit nearer the center, matching their distance rank.
              const angle = (index / Math.max(results.length, 1)) * 2 * Math.PI;
              const radiusFraction = 0.25 + (index % 3) * 0.2;
              const left = 50 + Math.cos(angle) * radiusFraction * 42;
              const top = 50 + Math.sin(angle) * radiusFraction * 42;
              const isSelected = row.hospital.id === selectedPinId;
              return (
                <Pressable
                  key={row.hospital.id}
                  onPress={() => setSelectedPinId(row.hospital.id)}
                  style={[styles.mapPin, { left: `${left}%`, top: `${top}%` }]}
                >
                  <Ionicons
                    name="location"
                    size={isSelected ? 36 : 28}
                    color={isSelected ? colors.secondary : colors.primary}
                  />
                </Pressable>
              );
            })}
          </View>

          {selectedPinId &&
            (() => {
              const selectedRow = results.find((row) => row.hospital.id === selectedPinId);
              if (!selectedRow) return null;
              return (
                <SearchResultCard
                  hospital={selectedRow.hospital}
                  meta={selectedRow.meta}
                  onPress={() => navigation.navigate('HospitalProfile', { hospitalId: selectedRow.hospital.id })}
                />
              );
            })()}

          <Pressable onPress={() => setViewMode('list')} style={styles.mapToListLink}>
            <Ionicons name="list-outline" size={16} color={colors.primary} />
            <Body style={styles.mapToListText}>View as list</Body>
          </Pressable>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={48} color={colors.neutralMuted} />
          <Heading style={styles.emptyHeading}>No results found for &apos;{query}&apos;.</Heading>
          <PrimaryButton label="Clear filters" onPress={handleClearFilters} />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(row) => row.hospital.id}
          contentContainerStyle={styles.resultsList}
          renderItem={({ item }) => (
            <SearchResultCard
              hospital={item.hospital}
              meta={item.meta}
              onPress={() => navigation.navigate('HospitalProfile', { hospitalId: item.hospital.id })}
            />
          )}
        />
      )}

      <FiltersPanel
        visible={isFiltersVisible}
        initialFilters={filters}
        onApply={setFilters}
        onClose={() => setFiltersVisible(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  noHorizontalPadding: {
    paddingHorizontal: 0,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  searchInputWrapper: {
    flex: 1,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.accent,
    padding: 2,
  },
  viewToggleOption: {
    minHeight: touchTarget.minimum - 12,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    borderRadius: 999,
  },
  viewToggleOptionActive: {
    backgroundColor: colors.primary,
  },
  viewToggleText: {
    fontSize: 14,
    color: colors.neutralDark,
  },
  viewToggleTextActive: {
    fontSize: 14,
    color: colors.white,
  },
  filterIconButton: {
    width: touchTarget.minimum - 8,
    height: touchTarget.minimum - 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.accent,
    backgroundColor: colors.white,
  },
  resultsList: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.xxxl,
  },
  emptyHeading: {
    fontSize: 18,
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  mapCanvas: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: colors.accent,
    overflow: 'hidden',
  },
  mapDisclaimer: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    color: colors.neutralMuted,
    textAlign: 'center',
  },
  mapPin: {
    position: 'absolute',
    transform: [{ translateX: -14 }, { translateY: -28 }],
  },
  mapToListLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: touchTarget.minimum,
  },
  mapToListText: {
    color: colors.primary,
    fontWeight: '600',
  },
});
