import { writeBatch, collection, doc, increment, arrayUnion } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { db } from "../auth.js";


export async function trackSearch(userId, query, results){
    try{
        const batch = writeBatch(db);
        const resultscount = results.length;
        const isSuccessful = resultscount>0;

        const eventRef = doc(collection(db, 'analytics', 'events', 'searches'))
        batch.set(eventRef, {
            userId: userId || 'anonymous',
            query,
            resultscount,
            isSuccessful,
            timestamp: Date.now()
        });

        if(isSuccessful){
            results.forEach(product=>{
                const productStatsRef = doc(db, 'analytics', 'productStats', 'items', product.id)
                batch.set(productStatsRef, {
                    searchCount: increment(1),
                    sectionId: product.sectionId,
                    lastUpdated: Date.now()
                }, { merge: true });
            })
        }
        else{
            const failedSearchRef = doc(collection(db, 'analytics', 'failedSearchStats', 'logs'))
            batch.set(failedSearchRef, {
                query,
                lastUpdataed: Date.now()
            }, { merge: true });
        }

        if(userId && userId!== 'anonymous'){
            const userActivityRef = doc(db, 'analytics', 'userActivity', 'users', userId);
            batch.set(userActivityRef, {
                recentSearches: arrayUnion(query),
                lastActive: Date.now()
            }, { merge: true })
        }


        await batch.commit();
    }
    catch(err){
        console.error(err);
    }
}