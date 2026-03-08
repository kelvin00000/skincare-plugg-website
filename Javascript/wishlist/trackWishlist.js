import { writeBatch, collection, doc, increment, arrayRemove, arrayUnion } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { db } from "../auth.js";

export async function trackWishlistAction(userId, productId, action) {
    const batch = writeBatch(db);
    
    const eventRef = doc(collection(db, 'analytics', 'events', 'wishlistActions'));
    batch.set(eventRef, {
        userId,
        productId,
        action, 
        timestamp: Date.now()
    });
    
    const productStatsRef = doc(db, 'analytics', 'productStats', 'items', productId);
    batch.set(productStatsRef, {
        wishlistCount: increment(action === 'added' ? 1 : -1),
        lastUpdated: Date.now()
    }, { merge: true });
    
    const userActivityRef = doc(db, 'analytics', 'userActivity', 'users', userId);
    batch.set(userActivityRef, {
        wishlistedProducts: action === 'added' 
            ? arrayUnion(productId)
            : arrayRemove(productId),
        lastActive: Date.now()
    }, { merge: true });
    
    await batch.commit();
}