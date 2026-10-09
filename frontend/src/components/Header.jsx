import { useAuth } from '../context/AuthContext'
import styles from './Header.module.css'

export default function Header({ theme, onToggleTheme }) {
  const { user, logout } = useAuth()

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.logo}>✅</span>
        <span className={styles.title}>Task Manager</span>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.themeBtn}
          onClick={onToggleTheme}
          aria-label="Alternar tema"
          title="Alternar tema claro/escuro"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {user && (
          <>
            <span className={styles.userName}>
              Olá, <strong>{user.name.split(' ')[0]}</strong>
            </span>
            <button className={styles.logoutBtn} onClick={logout}>
              Sair
            </button>
          </>
        )}
      </div>
    </header>
  )
}
