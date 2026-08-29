// Identity + report handoff with the GummyGum hub (a separate app on its
// own subdomain). The hub redirects here with a short-lived `ggt` token in
// the URL; we verify it once to find out who's playing, and hold onto the
// report token it hands back so we can post results when the session ends.
const API_URL = import.meta.env.VITE_GUMMYGUM_API_URL || 'http://localhost:8000';
const STORAGE_KEY = 'gummygum_launch_session';

export async function resolveGummyGumLaunch() {
  const params = new URLSearchParams(window.location.search);
  const ggt = params.get('ggt');

  if (!ggt) {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  try {
    const res = await fetch(`${API_URL}/api/gummygum/launch/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: ggt }),
    });
    const body = await res.json();
    if (!res.ok || !body.success) return null;

    const session = {
      sessionId: body.data.sessionId,
      experienceId: body.data.experienceId,
      isGuest: body.data.isGuest,
      player: body.data.player,
      reportToken: body.data.reportToken,
      roomCode: body.data.roomCode || null,
      isHost: Boolean(body.data.isHost),
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));

    // Drop the token from the visible URL/history once it's been used.
    params.delete('ggt');
    const query = params.toString();
    window.history.replaceState({}, '', window.location.pathname + (query ? `?${query}` : ''));

    return session;
  } catch (err) {
    console.error('GummyGum launch verify failed', err);
    return null;
  }
}

export async function reportGummyGumCancel() {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return;

  const session = JSON.parse(stored);
  try {
    await fetch(`${API_URL}/api/gummygum/launch/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportToken: session.reportToken }),
    });
  } catch (err) {
    console.error('GummyGum cancel report failed', err);
  } finally {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

export async function reportGummyGumResult(report) {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return;

  const session = JSON.parse(stored);
  try {
    await fetch(`${API_URL}/api/gummygum/launch/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportToken: session.reportToken, report }),
    });
  } catch (err) {
    console.error('GummyGum result report failed', err);
  } finally {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}
