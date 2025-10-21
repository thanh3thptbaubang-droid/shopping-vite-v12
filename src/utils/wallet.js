
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../firebase'

// Ensure wallet doc exists
export async function ensureWallet(uid){
  const ref = doc(db, 'wallets', uid)
  const snap = await getDoc(ref)
  if(!snap.exists()){
    await setDoc(ref, { balance: 0, transactions: [], updatedAt: new Date().toISOString() })
    return { balance:0 }
  }
  return snap.data()
}

// Add a transaction and update balance (simple merge behavior)
export async function addTransaction(uid, { type, amount, description, orderId=null }){
  const ref = doc(db, 'wallets', uid)
  await ensureWallet(uid)
  const tx = {
    id: 'tx_' + Date.now() + '_' + Math.floor(Math.random()*1000),
    type,
    amount: Number(amount),
    description: description || '',
    orderId: orderId || null,
    date: new Date().toISOString()
  }
  // read current balance
  const snap = await getDoc(ref)
  const prev = snap.exists() ? snap.data() : { balance:0, transactions:[] }
  const newBalance = (prev.balance || 0) + Number(tx.amount)
  try {
    await updateDoc(ref, { balance: newBalance, updatedAt: new Date().toISOString(), transactions: arrayUnion(tx) })
  } catch (err) {
    // fallback to setDoc merge
    await setDoc(ref, { balance: newBalance, updatedAt: new Date().toISOString(), transactions: arrayUnion(tx) }, { merge:true })
  }
  return tx
}

// Read admin commission rate from admin/stats doc, fallback to 0.08 (8%)
export async function getAdminRate(){
  try {
    const ref = doc(db, 'admin', 'stats')
    const snap = await getDoc(ref)
    if (snap && snap.exists()){
      const data = snap.data()
      if (typeof data.commissionRate === 'number') return data.commissionRate
    }
  } catch (err) {
    console.warn('Cannot read admin rate, using default 0.08', err.message)
  }
  return 0.08
}

// Quick helper to credit commissions: when order completes, call this for seller and admin
export async function distributeOrderCommissions(order){
  // order: { orderId, total, sellerId, adminRate (optional) }
  const adminRate = typeof order.adminRate === 'number' ? order.adminRate : await getAdminRate()
  const adminCommission = Math.round(order.total * adminRate)
  const sellerCommission = Number(order.total) - adminCommission
  // ensure wallets
  await ensureWallet('admin')
  await ensureWallet(order.sellerId)
  // add seller tx (positive)
  await addTransaction(order.sellerId, { type:'commission', amount: sellerCommission, description: 'Hoa hồng bán hàng cho đơn ' + order.orderId, orderId: order.orderId })
  // add admin tx (platform fee)
  await addTransaction('admin', { type:'platform_fee', amount: adminCommission, description: 'Phí nền tảng từ đơn ' + order.orderId, orderId: order.orderId })
  return { adminCommission, sellerCommission, adminRate }
}
