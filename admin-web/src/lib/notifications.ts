import { app } from './firebase';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  getDocs,
  writeBatch
} from 'firebase/firestore';

const db = getFirestore(app);

export type NotificationType = 
  | 'marks_uploaded' 
  | 'diary_posted' 
  | 'notice_published' 
  | 'fee_reminder' 
  | 'attendance_alert' 
  | 'homework_assigned' 
  | 'leave_status' 
  | 'certificate_ready';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  icon: string; // lucide icon name
  color: string; // accent color for the type
  metadata?: Record<string, any>; // extra data like studentName, className, etc.
  createdAt: number; // Date.now() timestamp
  createdBy: string; // user name who triggered it
  schoolId: string;
  targetAudience: 'all' | 'parents' | 'staff' | 'students';
  readBy: string[]; // array of user IDs who read it
}

export function getNotificationConfig(type: NotificationType): { icon: string; color: string } {
  switch (type) {
    case 'marks_uploaded':
      return { icon: 'Award', color: '#34C759' };
    case 'diary_posted':
      return { icon: 'BookMarked', color: '#C49B2A' };
    case 'notice_published':
      return { icon: 'Bell', color: '#FF9500' };
    case 'fee_reminder':
      return { icon: 'CreditCard', color: '#FF3B30' };
    case 'attendance_alert':
      return { icon: 'UserCheck', color: '#1B2A4A' };
    case 'homework_assigned':
      return { icon: 'BookOpen', color: '#AF52DE' };
    case 'leave_status':
      return { icon: 'Calendar', color: '#00C7BE' };
    case 'certificate_ready':
      return { icon: 'Award', color: '#FFD60A' };
    default:
      return { icon: 'Bell', color: '#8E8E93' };
  }
}

export type SendNotificationParams = Omit<AppNotification, 'id' | 'icon' | 'color' | 'createdAt' | 'readBy'> & {
  type: NotificationType;
};

export async function sendNotification(params: SendNotificationParams): Promise<string> {
  try {
    const config = getNotificationConfig(params.type);
    
    const notificationData: Omit<AppNotification, 'id'> = {
      ...params,
      icon: config.icon,
      color: config.color,
      createdAt: Date.now(),
      readBy: [],
    };

    const docRef = await addDoc(collection(db, 'notifications'), notificationData);
    return docRef.id;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw new Error('Failed to send notification');
  }
}

export function subscribeToNotifications(
  schoolId: string,
  callback: (notifications: AppNotification[]) => void
) {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('schoolId', '==', schoolId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifications: AppNotification[] = [];
      snapshot.forEach((docSnap) => {
        notifications.push({ id: docSnap.id, ...docSnap.data() } as AppNotification);
      });
      callback(notifications);
    }, (error) => {
      console.error('Error subscribing to notifications:', error);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up notification subscription:', error);
    throw new Error('Failed to subscribe to notifications');
  }
}

export async function markAsRead(notificationId: string, userId: string): Promise<void> {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      readBy: arrayUnion(userId)
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw new Error('Failed to mark notification as read');
  }
}

export async function markAllAsRead(schoolId: string, userId: string): Promise<void> {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('schoolId', '==', schoolId)
    );
    
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    
    let updatedCount = 0;
    
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const readBy = data.readBy || [];
      if (!readBy.includes(userId)) {
        batch.update(docSnap.ref, {
          readBy: arrayUnion(userId)
        });
        updatedCount++;
        
        // Firestore batch limit is 500
        if (updatedCount === 500) {
          console.warn('Reached max batch size for markAllAsRead (500). Partial update applied.');
        }
      }
    });

    if (updatedCount > 0 && updatedCount <= 500) {
      await batch.commit();
    }
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw new Error('Failed to mark all notifications as read');
  }
}
