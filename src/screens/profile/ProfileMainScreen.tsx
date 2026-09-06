import React, { useCallback, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import MenuListItem from '../../components/MenuListItem';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryLink from '../../components/SecondaryLink';
import { Body, Caption, Heading } from '../../components/Typography';
import { useLanguage } from '../../i18n/LanguageContext';
import { getUserProfile, type UserProfile } from '../../state/userProfileStore';
import { logout } from '../../state/accountActions';
import { resetToSplash } from '../../navigation/navigationRef';
import { colors, fonts, radius, spacing } from '../../theme/tokens';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileMain'>;

function getInitials(profile: UserProfile): string {
  const first = profile.firstName.trim().charAt(0);
  const last = profile.lastName.trim().charAt(0);
  const initials = `${first}${last}`.toUpperCase();
  return initials || '?';
}

export default function ProfileMainScreen({ navigation }: Props) {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      getUserProfile().then((result) => {
        if (isActive) setProfile(result);
      });
      return () => {
        isActive = false;
      };
    }, []),
  );

  const fullName = profile ? `${profile.firstName} ${profile.lastName}`.trim() : '';

  const handleConfirmLogout = async () => {
    setLogoutModalVisible(false);
    await logout();
    resetToSplash();
  };

  return (
    <ScreenContainer style={styles.noHorizontalPadding}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Heading style={styles.title}>{t('profileTitle')}</Heading>

        <View style={styles.identityBlock}>
          <View style={styles.avatar}>
            <Body style={styles.avatarText}>{profile ? getInitials(profile) : ''}</Body>
          </View>
          <Body style={styles.name}>{fullName || 'Your name'}</Body>
          <Caption>{profile?.phoneNumber ? `+91-${profile.phoneNumber}` : 'Phone not set'}</Caption>
        </View>

        <View style={styles.menu}>
          <MenuListItem
            icon="person-outline"
            label={t('menuEditProfile')}
            onPress={() => navigation.navigate('EditProfile')}
          />
          <MenuListItem
            icon="notifications-outline"
            label={t('menuNotificationPreferences')}
            onPress={() => navigation.navigate('NotificationPreferences')}
          />
          <MenuListItem
            icon="language-outline"
            label={t('menuLanguage')}
            onPress={() => navigation.navigate('LanguageToggle')}
          />
          <MenuListItem
            icon="help-circle-outline"
            label={t('menuHelpFaq')}
            onPress={() => navigation.navigate('HelpFaq')}
          />
          <MenuListItem
            icon="shield-checkmark-outline"
            label={t('menuPrivacySettings')}
            onPress={() => navigation.navigate('PrivacySettings')}
          />
          <MenuListItem
            icon="alert-circle-outline"
            label={t('menuGrievance')}
            onPress={() => navigation.navigate('GrievanceSubmission')}
          />
          <MenuListItem
            icon="trash-outline"
            label={t('menuDeleteAccount')}
            onPress={() => navigation.navigate('DeleteAccount')}
            destructive
          />
          <MenuListItem
            icon="log-out-outline"
            label={t('menuLogout')}
            onPress={() => setLogoutModalVisible(true)}
          />
        </View>
      </ScrollView>

      <Modal
        visible={isLogoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setLogoutModalVisible(false)}>
          <Pressable style={styles.modalCard}>
            <Body style={styles.modalTitle}>Are you sure you want to log out?</Body>
            <View style={styles.modalActions}>
              <PrimaryButton label="Log out" onPress={handleConfirmLogout} />
              <SecondaryLink label="Cancel" onPress={() => setLogoutModalVisible(false)} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  noHorizontalPadding: {
    paddingHorizontal: 0,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  title: {
    paddingHorizontal: spacing.xxl,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  identityBlock: {
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xxl,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 24,
    color: colors.primary,
  },
  name: {
    fontSize: 16,
  },
  menu: {
    gap: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(31, 41, 55, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  modalCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: radius.large,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 16,
  },
  modalActions: {
    alignItems: 'center',
    gap: spacing.md,
  },
});
