# Trojan FC Admin

Trojan FC Admin is a web application to help manage and strategize for a 7-a-side football team. Drag and drop players onto the pitch, manage your roster, set your team's formation and captain, and track your season's progress.

## Features

- **Drag-and-drop Tactics Board:** Arrange your starting lineup and assign roles (captain, penalty taker, etc.).
- **Player Roster Management:** Add, edit, and remove players with details like skill, age, and position.
- **Save & Load:** Download and upload your full team data or just the roster for backup and sharing.
- **Season Tracking:** Manage matches, results, and view league tables and statistics.
- **Multi-language Support:** Switch between English and Spanish.
- **Responsive Design:** Works on desktop and mobile devices.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/trojan-fc-manager.git
   cd trojan-fc-manager
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Run the development server:**
   ```sh
   npm run dev
   ```

4. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173) (or the URL shown in your terminal).

### Build for Production

```sh
npm run build
```

The production-ready files will be in the `dist/` directory.

## Project Structure

- `App.tsx`: Main application component.
- `components/`: UI components, organized by feature.
- `contexts/`: React context providers (e.g., language).
- `hooks/`: Custom React hooks.
- `i18n/`: Translation files for multi-language support.
- `localData/`: Example backup data.
- `types.ts`: TypeScript type definitions.
- `constants.ts`: App-wide constants.

## Data Management

- **Save All Data:** Download a backup of your entire app state as a JSON file.
- **Load All Data:** Restore your app state from a backup JSON file.
- **Quick Save:** Save your current state to your browser's local storage.
- **Roster Only:** Save/load just the player roster for quick edits.

## Internationalization

Switch between English and Spanish using the language toggle in the app bar.

## License

This project is for personal/team use. See [LICENSE](LICENSE) if present.

---

*Made with React and TypeScript.*
