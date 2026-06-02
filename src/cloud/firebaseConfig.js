// Firebase Web App config — Firebase Console 에서 받은 값으로 채워주세요.
//
// 받는 곳: Firebase Console > Project settings > Your apps > Web app > SDK setup
// 빈 상태로 두면 cloud save 비활성화 (localStorage 만 사용).
//
// 이 파일의 값들은 *공개*되어도 안전합니다 (client-side 노출 전제).
// 실제 보호는 Firestore 보안 규칙으로 — 다른 사용자의 데이터 read/write 차단.
export const firebaseConfig = {
  apiKey:            "AIzaSyDvNBgr4Q_gYvHeQpmWl4U2EluG9-PaKfA",
  // 서빙 도메인(web.app)과 일치시켜야 로그인 핸들러(/__/auth/handler)가 first-party가 된다.
  // firebaseapp.com 으로 두면 web.app 에서 크로스 오리진 → Chrome 서드파티 저장소 차단으로 로그인 실패.
  authDomain:        "baseball-alone.web.app",
  projectId:         "baseball-alone",
  storageBucket:     "baseball-alone.firebasestorage.app",
  messagingSenderId: "126672611400",
  appId:             "1:126672611400:web:4ff9ed49e1134f5abe107d",
};
