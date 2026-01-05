import { useCallback } from 'react';
import { notificationService } from '../services/notificationService';

export const useNotifications = () => {
  // Job application notifications
  const notifyApplicationSubmitted = useCallback((userId: string, applicationData: any) => {
    notificationService.onApplicationSubmitted(userId, applicationData);
  }, []);

  const notifyApplicationStatusChanged = useCallback((userId: string, applicationData: any) => {
    notificationService.onApplicationStatusChanged(userId, applicationData);
  }, []);

  const notifyApplicationRated = useCallback((userId: string, ratingData: any) => {
    notificationService.onApplicationRated(userId, ratingData);
  }, []);

  // Job offer notifications
  const notifyJobOfferApproved = useCallback((companyUserId: string, jobData: any) => {
    notificationService.onJobOfferApproved(companyUserId, jobData);
  }, []);

  const notifyJobOfferRejected = useCallback((companyUserId: string, jobData: any) => {
    notificationService.onJobOfferRejected(companyUserId, jobData);
  }, []);

  // Event notifications
  const notifyEventApproved = useCallback((companyUserId: string, eventData: any) => {
    notificationService.onEventApproved(companyUserId, eventData);
  }, []);

  const notifyEventRejected = useCallback((companyUserId: string, eventData: any) => {
    notificationService.onEventRejected(companyUserId, eventData);
  }, []);

  // Admin notifications
  const notifyAdminNewJobOffer = useCallback((adminUserId: string = 'admin1') => {
    notificationService.onNewJobOfferSubmitted(adminUserId);
  }, []);

  const notifyAdminNewEvent = useCallback((adminUserId: string = 'admin1') => {
    notificationService.onNewEventSubmitted(adminUserId);
  }, []);

  // Profile notifications
  const notifyProfileUpdated = useCallback((userId: string, userType: 'user' | 'company' | 'admin') => {
    notificationService.onProfileUpdated(userId, userType);
  }, []);

  const notifyPasswordChanged = useCallback((userId: string, userType: 'user' | 'company' | 'admin') => {
    notificationService.onPasswordChanged(userId, userType);
  }, []);

  // Trigger multiple notifications at once
  const notifyJobOfferSubmitted = useCallback((companyUserId: string, jobData: any) => {
    // Notify admin about new job offer to review
    notifyAdminNewJobOffer();
    
    // This could also notify matching users, but we'll do that after approval
    console.log('📧 Job offer submitted notifications sent');
  }, [notifyAdminNewJobOffer]);

  const notifyEventSubmitted = useCallback((companyUserId: string, eventData: any) => {
    // Notify admin about new event to review
    notifyAdminNewEvent();
    
    console.log('📧 Event submitted notifications sent');
  }, [notifyAdminNewEvent]);

  // Custom notification for specific actions
  const triggerCustomNotification = useCallback((
    userId: string,
    userType: 'user' | 'company' | 'admin',
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string,
    actionUrl?: string,
    actionText?: string
  ) => {
    notificationService.createNotification('custom', userId, userType, {
      custom_title: title,
      custom_message: message,
      custom_action_url: actionUrl,
      custom_action_text: actionText
    });
  }, []);

  // Education notifications
  const notifyNewCourse = useCallback((userId: string, courseData: any) => {
    notificationService.createNotification('new_course_available', userId, 'user', courseData);
  }, []);

  const notifyCourseCompleted = useCallback((userId: string, courseData: any) => {
    notificationService.createNotification('course_completed', userId, 'user', courseData);
  }, []);

  const notifyQuizResult = useCallback((userId: string, quizData: any) => {
    notificationService.createNotification('quiz_result', userId, 'user', quizData);
  }, []);

  const notifyStudyReminder = useCallback((userId: string, reminderData: any) => {
    notificationService.createNotification('study_reminder', userId, 'user', reminderData);
  }, []);

  // Drug database notifications
  const notifyNewDrug = useCallback((drugData: any) => {
    // Notify all users and admins
    notificationService.createNotification('new_drug_added', 'user1', 'user', drugData);
    notificationService.createNotification('new_drug_added', 'admin1', 'admin', drugData);
  }, []);

  const notifyDrugInteraction = useCallback((userId: string, interactionData: any) => {
    notificationService.createNotification('drug_interaction_alert', userId, 'user', interactionData);
  }, []);

  const notifyDrugRecall = useCallback((recallData: any) => {
    // Critical alert for all user types
    ['user1', 'company1', 'admin1'].forEach(id => {
      const userType = id.includes('admin') ? 'admin' : id.includes('company') ? 'company' : 'user';
      notificationService.createNotification('drug_recalled', id, userType as any, recallData);
    });
  }, []);

  const notifyDrugShortage = useCallback((shortageData: any) => {
    notificationService.createNotification('drug_shortage', 'user1', 'user', shortageData);
    notificationService.createNotification('drug_shortage', 'company1', 'company', shortageData);
  }, []);

  // Calculator notifications
  const notifyNewCalculator = useCallback((userId: string, calculatorData: any) => {
    notificationService.createNotification('new_calculator', userId, 'user', calculatorData);
  }, []);

  const notifyCalculatorUpdated = useCallback((userId: string, calculatorData: any) => {
    notificationService.createNotification('calculator_updated', userId, 'user', calculatorData);
  }, []);

  const notifyCalculationSaved = useCallback((userId: string, calculationData: any) => {
    notificationService.createNotification('calculation_saved', userId, 'user', calculationData);
  }, []);

  // Shop notifications
  const notifyOrderConfirmed = useCallback((userId: string, userType: 'user' | 'company', orderData: any) => {
    notificationService.createNotification('order_confirmed', userId, userType, orderData);
  }, []);

  const notifyOrderShipped = useCallback((userId: string, userType: 'user' | 'company', orderData: any) => {
    notificationService.createNotification('order_shipped', userId, userType, orderData);
  }, []);

  const notifyOrderDelivered = useCallback((userId: string, userType: 'user' | 'company', orderData: any) => {
    notificationService.createNotification('order_delivered', userId, userType, orderData);
  }, []);

  const notifyProductBackInStock = useCallback((productData: any) => {
    // Notify interested users
    ['user1', 'company1'].forEach(id => {
      const userType = id.includes('company') ? 'company' : 'user';
      notificationService.createNotification('product_back_in_stock', id, userType as any, productData);
    });
  }, []);

  const notifyPriceDrop = useCallback((productData: any) => {
    ['user1', 'company1'].forEach(id => {
      const userType = id.includes('company') ? 'company' : 'user';
      notificationService.createNotification('price_drop', id, userType as any, productData);
    });
  }, []);

  // Newsletter notifications
  const notifyNewsletterSubscription = useCallback((userId: string, userType: 'user' | 'company') => {
    notificationService.createNotification('newsletter_subscription', userId, userType);
  }, []);

  const notifyWeeklyNews = useCallback((newsData: any) => {
    ['user1', 'company1'].forEach(id => {
      const userType = id.includes('company') ? 'company' : 'user';
      notificationService.createNotification('weekly_medical_news', id, userType as any, newsData);
    });
  }, []);

  const notifyBreakingNews = useCallback((newsData: any) => {
    ['user1', 'company1', 'admin1'].forEach(id => {
      const userType = id.includes('admin') ? 'admin' : id.includes('company') ? 'company' : 'user';
      notificationService.createNotification('breaking_medical_news', id, userType as any, newsData);
    });
  }, []);

  // University notifications
  const notifyNewUniversity = useCallback((userId: string, universityData: any) => {
    notificationService.createNotification('new_university_added', userId, 'user', universityData);
  }, []);

  const notifyApplicationDeadline = useCallback((userId: string, deadlineData: any) => {
    notificationService.createNotification('application_deadline', userId, 'user', deadlineData);
  }, []);

  const notifyScholarship = useCallback((userId: string, scholarshipData: any) => {
    notificationService.createNotification('scholarship_available', userId, 'user', scholarshipData);
  }, []);

  // Security notifications
  const notifyNewDeviceLogin = useCallback((userId: string, userType: 'user' | 'company' | 'admin', deviceData: any) => {
    notificationService.createNotification('login_from_new_device', userId, userType, deviceData);
  }, []);

  const notifySuspiciousActivity = useCallback((userId: string, userType: 'user' | 'company' | 'admin', activityData: any) => {
    notificationService.createNotification('suspicious_activity', userId, userType, activityData);
  }, []);

  const notifyAccountLocked = useCallback((userId: string, userType: 'user' | 'company' | 'admin', lockData: any) => {
    notificationService.createNotification('account_locked', userId, userType, lockData);
  }, []);

  // Subscription notifications
  const notifyPremiumActivated = useCallback((userId: string, userType: 'user' | 'company', subscriptionData: any) => {
    notificationService.createNotification('premium_activated', userId, userType, subscriptionData);
  }, []);

  const notifyPremiumExpiring = useCallback((userId: string, userType: 'user' | 'company', expiryData: any) => {
    notificationService.createNotification('premium_expiring', userId, userType, expiryData);
  }, []);

  const notifyPremiumExpired = useCallback((userId: string, userType: 'user' | 'company') => {
    notificationService.createNotification('premium_expired', userId, userType);
  }, []);

  // Achievement notifications
  const notifyFirstApplication = useCallback((userId: string) => {
    notificationService.createNotification('first_application', userId, 'user');
  }, []);

  const notifyProfileComplete = useCallback((userId: string, userType: 'user' | 'company') => {
    notificationService.createNotification('profile_complete', userId, userType);
  }, []);

  const notifyActiveStreak = useCallback((userId: string, streakData: any) => {
    notificationService.createNotification('active_user_streak', userId, 'user', streakData);
  }, []);

  // Reminder notifications
  const notifyIncompleteApplication = useCallback((userId: string, applicationData: any) => {
    notificationService.createNotification('incomplete_application', userId, 'user', applicationData);
  }, []);

  const notifyProfileIncomplete = useCallback((userId: string, userType: 'user' | 'company', profileData: any) => {
    notificationService.createNotification('profile_incomplete', userId, userType, profileData);
  }, []);

  const notifyInterviewReminder = useCallback((userId: string, interviewData: any) => {
    notificationService.createNotification('interview_tomorrow', userId, 'user', interviewData);
  }, []);

  // System notifications
  const notifyMaintenanceScheduled = useCallback((maintenanceData: any) => {
    ['user1', 'company1', 'admin1'].forEach(id => {
      const userType = id.includes('admin') ? 'admin' : id.includes('company') ? 'company' : 'user';
      notificationService.createNotification('maintenance_scheduled', id, userType as any, maintenanceData);
    });
  }, []);

  const notifyNewFeature = useCallback((featureData: any) => {
    ['user1', 'company1', 'admin1'].forEach(id => {
      const userType = id.includes('admin') ? 'admin' : id.includes('company') ? 'company' : 'user';
      notificationService.createNotification('new_feature_available', id, userType as any, featureData);
    });
  }, []);

  const notifyDataExportReady = useCallback((userId: string, userType: 'user' | 'company') => {
    notificationService.createNotification('data_export_ready', userId, userType);
  }, []);

  const notifyMedicalEmergency = useCallback((emergencyData: any) => {
    // Critical alert for all users
    ['user1', 'company1', 'admin1'].forEach(id => {
      const userType = id.includes('admin') ? 'admin' : id.includes('company') ? 'company' : 'user';
      notificationService.createNotification('medical_emergency_alert', id, userType as any, emergencyData);
    });
  }, []);

  return {
    // Application notifications
    notifyApplicationSubmitted,
    notifyApplicationStatusChanged,
    notifyApplicationRated,
    
    // Job offer notifications
    notifyJobOfferSubmitted,
    notifyJobOfferApproved,
    notifyJobOfferRejected,
    
    // Event notifications
    notifyEventSubmitted,
    notifyEventApproved,
    notifyEventRejected,
    
    // Admin notifications
    notifyAdminNewJobOffer,
    notifyAdminNewEvent,
    
    // Profile notifications
    notifyProfileUpdated,
    notifyPasswordChanged,
    
    // Education notifications
    notifyNewCourse,
    notifyCourseCompleted,
    notifyQuizResult,
    notifyStudyReminder,
    
    // Drug database notifications
    notifyNewDrug,
    notifyDrugInteraction,
    notifyDrugRecall,
    notifyDrugShortage,
    
    // Calculator notifications
    notifyNewCalculator,
    notifyCalculatorUpdated,
    notifyCalculationSaved,
    
    // Shop notifications
    notifyOrderConfirmed,
    notifyOrderShipped,
    notifyOrderDelivered,
    notifyProductBackInStock,
    notifyPriceDrop,
    
    // Newsletter notifications
    notifyNewsletterSubscription,
    notifyWeeklyNews,
    notifyBreakingNews,
    
    // University notifications
    notifyNewUniversity,
    notifyApplicationDeadline,
    notifyScholarship,
    
    // Security notifications
    notifyNewDeviceLogin,
    notifySuspiciousActivity,
    notifyAccountLocked,
    
    // Subscription notifications
    notifyPremiumActivated,
    notifyPremiumExpiring,
    notifyPremiumExpired,
    
    // Achievement notifications
    notifyFirstApplication,
    notifyProfileComplete,
    notifyActiveStreak,
    
    // Reminder notifications
    notifyIncompleteApplication,
    notifyProfileIncomplete,
    notifyInterviewReminder,
    
    // System notifications
    notifyMaintenanceScheduled,
    notifyNewFeature,
    notifyDataExportReady,
    notifyMedicalEmergency,
    
    // Custom notification
    triggerCustomNotification,
  };
};