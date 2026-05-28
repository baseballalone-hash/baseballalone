// Firebase Auth — 익명 자동 로그인.
//
// 전략:
//   - 앱 첫 진입 시 anon 로그인 자동 (uid 생성, 기기 종속).
//   - state.cloudUser = { uid, isAnonymous, displayName?, email? } 에 attach.
//   - onAuthStateChanged 리스너로 로그아웃/로그인 변화 추적.
//   - Phase D 에서 Google linking 추가 시 같은 uid 유지하면서 영구 계정으로 업그레이드.

import {
  signInAnonymously, onAuthStateChanged, signOut as fbSignOut,
  GoogleAuthProvider, signInWithPopup, linkWithPopup,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { state } from "../state.js";
import { getFirebaseAuth, isFirebaseReady } from "./firebase.js";

export function initAuth() {
  if (!isFirebaseReady()) return;
  const auth = getFirebaseAuth();

  onAuthStateChanged(auth, user => {
    if (user) {
      state.cloudUser = {
        uid:          user.uid,
        isAnonymous:  user.isAnonymous,
        displayName:  user.displayName ?? null,
        email:        user.email ?? null,
      };
    } else {
      state.cloudUser = null;
      // 자동 익명 로그인 — 사용자 의식 없이 cloud 사용 가능.
      signInAnonymously(auth).catch(e => {
        console.error("[cloud] 익명 로그인 실패", e);
      });
    }
  });
}

export function isSignedIn() {
  return !!state.cloudUser?.uid;
}

export function currentUid() {
  return state.cloudUser?.uid ?? null;
}

export function isAnonymousUser() {
  return !!state.cloudUser?.isAnonymous;
}

// 익명 → Google 계정 연동. 같은 uid 유지하며 영구 계정으로 업그레이드.
// 이미 영구 계정이면 alreadyLinked: true.
// 그 Google 계정이 이미 다른 익명 uid 에 link 되어 있으면 credential-already-in-use 에러.
export async function linkAnonToGoogle() {
  if (!isFirebaseReady()) return { ok: false, reason: "firebase_not_ready" };
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) return { ok: false, reason: "no_user" };

  const provider = new GoogleAuthProvider();
  try {
    if (user.isAnonymous) {
      const result = await linkWithPopup(user, provider);
      return { ok: true, user: result.user };
    }
    return { ok: true, user, alreadyLinked: true };
  } catch (e) {
    console.error("[cloud] linkAnonToGoogle 실패", e);
    return { ok: false, reason: "link_failed", code: e.code, error: e.message };
  }
}

// Google 로그인 (link 실패 또는 다른 계정 진입). 익명 데이터는 잃음.
export async function signInWithGoogle() {
  if (!isFirebaseReady()) return { ok: false, reason: "firebase_not_ready" };
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return { ok: true, user: result.user };
  } catch (e) {
    console.error("[cloud] signInWithGoogle 실패", e);
    return { ok: false, reason: "signin_failed", code: e.code, error: e.message };
  }
}

// 로그아웃 후 자동으로 익명 재로그인 (onAuthStateChanged 가 처리).
export async function signOutCloud() {
  if (!isFirebaseReady()) return false;
  const auth = getFirebaseAuth();
  try {
    await fbSignOut(auth);
    return true;
  } catch (e) {
    console.error("[cloud] signOut 실패", e);
    return false;
  }
}
