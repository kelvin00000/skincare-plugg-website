import { writeBatch, collection, doc, increment } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { db } from "../auth.js";

export async function trackProductView(userId, sectionId, productId){
    try{
        const batch = writeBatch(db);

        const eventRef = doc(collection(db, 'analytics', 'events', 'productViews'));
        batch.set(eventRef, {
            userId: userId || 'anonymous',
            sectionId,
            productId,
            timestamp: Date.now()
        });
        
        const productStatsRef = doc(db, 'analytics', 'productStats', 'items', productId);
        batch.set(productStatsRef, {
            viewCount: increment(1),
            sectionId,
            lastUpdated: Date.now()
        }, { merge: true });
        
        if(userId && userId!== 'anonymous'){
            const userActivityRef = doc(db, 'analytics', 'userActivity', 'users', userId);
            batch.set(userActivityRef, {
                [`viewedProducts.${productId}`]: increment(1),
                lastActive: Date.now()
            }, { merge: true });
        }


        await batch.commit();
    }
    catch(err){
        console.error(err)
    }
}