# Dependency Detail — Android

**Folder:** `main/` · **Package:** `foundation.sohaeltasneem.app`

---

## Module dependencies

```
app
 ├─ core
 ├─ domain
 ├─ data
 │   ├─ network
 │   ├─ database
 │   └─ security
 ├─ ui
 └─ notifications
devmockserver  (never a dependency of app)
```

## Internal dependencies

| Depends on | Kind | Path-sensitive |
|---|---|---|
| `main/settings.gradle.kts` | Build | Yes |
| `main/build.gradle.kts` | Build | Yes |
| `main/gradle/wrapper/` | Build | Yes |
| `main/app/build.gradle.kts` | Build | Yes |
| `main/keystore.properties` | Signing | Yes — gitignored |
| `main/local.properties` | SDK path | Yes — gitignored |
| `main/core/src/main/res/font/` | Fonts | Yes |
| `main/core/src/main/res/drawable-nodpi/logo_stfl_full.png` | Logo | Yes |

## External dependencies

| Depends on | Kind |
|---|---|
| `https://stflbd.app/api/v1` | API |
| `https://stflbd.org` | Foundation link |
| `https://stflbd.app` | App link |
| Android SDK API 26–37 | Build |
| JDK 21 | Build |
| Gradle 9.8.1 | Build |

## Build chain

```
.\gradlew.bat clean
.\gradlew.bat :app:assembleDebug
.\gradlew.bat :app:bundleRelease
```

## Production safety gate

`main/app/build.gradle.kts` refuses a release build with a mock or localhost URL. `STFL_API_BASE_URL` must be the production endpoint or unset.

## Safe to move?

**No.** Gradle config, signing config, and canonical source map all depend on this location.