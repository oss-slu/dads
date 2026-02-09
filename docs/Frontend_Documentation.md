# DynaBase Frontend Documentation

*This document was created with the assistance of Claude Opus 4.5 (2 Feb 2026)*

## Table of Contents

1.  [Overview](#overview)
2.  [Project Structure](#project-structure)
3.  [Core Application Files](#core-application-files)
4.  [Context Files (Global State Management)](#context-files-global-state-management)
5.  [API Communication](#api-communication)
6.  [Page Components](#page-components)
7.  [UI Components](#ui-components)
8.  [FunctionDetail Components](#functiondetail-components)
9.  [Error Handling Components](#error-handling-components)
10. [How Everything Connects Together](#how-everything-connects-together)

---

## Overview

**DynaBase** is a web application designed to explore and search a database of arithmetic dynamical systems. The frontend is built using **React**, a popular JavaScript library for building user interfaces. The application allows users to:

- Browse and filter dynamical systems based on various mathematical properties
- View detailed information about individual systems
- Explore families of dynamical systems
- Export data for further analysis
- Access mathematical background information

---

## Project Structure

```
Frontend/
├── src/
│   ├── index.js                 # Entry point - starts the application
│   ├── App.js                   # Main application - defines page routes
│   ├── App.css                  # Global styles
│   ├── api/
│   │   └── routes.js            # All backend communication functions
│   ├── context/
│   │   ├── FilterContext.js     # Manages filter state globally
│   │   └── PageContext.js       # Manages pagination state globally
│   ├── pages/
│   │   ├── AboutPage.js         # Homepage with project information
│   │   ├── ExploreSystems.js    # Main search/filter page
│   │   ├── Families.js          # Browse families of systems
│   │   ├── FamilyDetails.js     # Detailed view of a family
│   │   └── SystemDetails.js     # Detailed view of a system
│   ├── components/
│   │   ├── Topbar.js            # Navigation bar at top
│   │   ├── Sidebar.js           # Side navigation (alternative)
│   │   ├── DataTable.js         # Basic table display
│   │   ├── PaginatedDataTable.js # Table with page navigation
│   │   ├── ActiveFiltersBanner.js # Shows current active filters
│   │   ├── PDFViewer.js         # Displays PDF documents
│   │   └── FunctionDetail/      # Components for system details
│   │       ├── InfoTable.js
│   │       ├── InfoTable2.js
│   │       ├── InfoTable3.js
│   │       ├── ModelsTable.js
│   │       ├── MultiplierInvariantsTable.js
│   │       ├── RationalPointsTable.js
│   │       ├── CriticalPointsTable.js
│   │       ├── CriticalPointPortraitTable.js
│   │       ├── FunctionAttributes.js
│   │       ├── CitationsTable.js
│   │       ├── RationalTwistsTable.js
│   │       ├── AutomorphismGroupTable.js
│   │       ├── HelpBox.js
│   │       ├── Copy.js
│   │       ├── AdjacencyMatrix.js
│   │       └── SageMathCell.js
│   └── errorreport/
│       ├── ReportGeneralError.js # Minor error notifications
│       └── ReportMajorError.js   # Major error dialogs
```

---

## Core Application Files

### index.js

**Purpose**: This is the entry point of the entire application - the first file that runs when the app starts.

**What It Does**:
1. Creates the root element where React will render the application
2. Wraps the entire app in "Providers" (explained below) so all pages can access shared data
3. Starts the App component

**Key Functions**:

| Element | Description |
|---------|-------------|
| `ReactDOM.createRoot()` | Tells React where to display the app (in an HTML element with id="root") |
| `<React.StrictMode>` | Development helper that warns about potential problems |
| `<FilterProvider>` | Makes filter data available to all child components |
| `<PageProvider>` | Makes pagination data available to all child components |
| `<App/>` | The main application component |

**How It Connects**: This file is the foundation. It wraps the entire application in context providers, meaning any component anywhere in the app can access filter and page data without passing it through every level manually.

**Uses**:
- `App.js` - The main application component
- `FilterContext.js` - Provides `FilterProvider` wrapper
- `PageContext.js` - Provides `PageProvider` wrapper

**Used By**:
- None (this is the entry point)

---

### App.js

**Purpose**: Defines the main structure of the application and sets up navigation between different pages.

**What It Does**:
1. Sets up the routing system (which URL shows which page)
2. Includes the navigation bar that appears on every page
3. Defines all available pages and their URLs

**Route Definitions**:

| URL Path | Page Component | Description |
|----------|----------------|-------------|
| `/` (home) | `AboutPage` | Homepage with project information |
| `/exploreSystems` | `ExploreSystems` | Main search and filter page |
| `/families` | `Families` | Browse all families |
| `/system/:label` | `SystemDetails` | View details of one system (`:label` is a variable) |
| `/family-details/:familyId` | `FamilyDetails` | View details of one family |

**Key Concepts**:

- **BrowserRouter**: Enables navigation without page reloads
- **Routes**: Container for all route definitions
- **Route**: Maps a URL path to a component
- `:label` and `:familyId`: Dynamic parameters - the actual value comes from the URL

**How It Connects**: App.js is like a traffic controller. When a user types a URL or clicks a link, this file determines which page component to display. The `<Topbar />` appears on every page because it's outside the `<Routes>`.

**Uses**:
- `Topbar.js` - Navigation bar shown on all pages
- `AboutPage.js` - Home page component
- `ExploreSystems.js` - Search/filter page component
- `Families.js` - Families list page component
- `SystemDetails.js` - System detail page component
- `FamilyDetails.js` - Family detail page component

**Used By**:
- `index.js` - Renders the App component

---

## Context Files (Global State Management)

### FilterContext.js

**Purpose**: Creates a global "storage space" for filter settings that any component can access and modify.

**Why It's Needed**: Without context, if you wanted to share filter data between the sidebar and the results table, you'd have to pass it through every component in between. Context lets components access data directly.

**What It Does**:
1. Creates a "context" (shared data container)
2. Provides a hook (`useFilters`) for components to access the filters
3. Stores all possible filter options and their current values

**Available Filter Properties**:

| Filter Name | Type | Description |
|-------------|------|-------------|
| `dimension` | Array | Domain dimension (P¹, P²) |
| `degree` | Array | Polynomial degree |
| `is_polynomial` | Array | Whether it's a polynomial map |
| `is_Lattes` | Array | Whether it's a Lattès map |
| `family` | Array | Family IDs to filter by |
| `is_Chebyshev` | Array | Whether it's a Chebyshev polynomial |
| `is_Newton` | Array | Whether it's a Newton function |
| `is_pcf` | Array | Whether it's postcritically finite |
| `customDegree` | String | User-entered custom degree |
| `customDimension` | String | User-entered custom dimension |
| `automorphism_group_cardinality` | String | Automorphism group size |
| `base_field_label` | String | Base field identifier |
| `base_field_degree` | String | Degree of the base field |
| `indeterminacy_locus_dimension` | String | Dimension of indeterminacy locus |
| `cp_cardinality` | String | Critical points count |
| `periodic_cycles` | String | Number of periodic cycles |
| `sigma_one` | String | First sigma invariant |
| `sigma_two` | String | Second sigma invariant |
| `model_label` | String | Specific model label search |
| `journal_label` | String | Journal citation filter |


**Uses**:
- None (only React)

**Used By**:
- `index.js` - Wraps app with `FilterProvider`
- `ExploreSystems.js` - Reads/writes filter values
- `Families.js` - Writes family filter on click

---

### PageContext.js

**Purpose**: Manages the current page number for pagination across the application.

**What It Does**:
1. Stores the current page number
2. Provides access via `usePage` hook
3. Allows any component to read or change the current page

**How It Connects**: When a user navigates to a system's details and then returns to the search page, the page number is remembered because it's stored in this global context.

**Uses**:
- None (only React)

**Used By**:
- `index.js` - Wraps app with `PageProvider`
- `ExploreSystems.js` - Reads/writes current page number

---

## API Communication

### routes.js

**Purpose**: Contains all functions that communicate with the backend server. This file is the bridge between the frontend (what users see) and the backend (where data is stored).

**What It Does**:
1. Defines functions for each type of data request
2. Uses **axios** (a library for making HTTP requests) to communicate with the server
3. Returns promises (operations that complete in the future)

**All API Functions**:

#### get_systems()

**Purpose**: Retrieves ALL dynamical systems from the database.
**Method**: GET (asking for data)
**Returns**: Array of all system data

---

#### get_system(label)

**Purpose**: Retrieves detailed information about ONE specific system.
**Method**: POST (sending data to get specific results)
**Parameter**: `label` - Object containing the system's ID
**Returns**: Complete data for that one system

---

#### get_selected_systems(labels)

**Purpose**: Retrieves data for multiple specific systems (used for CSV export).
**Parameter**: `labels` - Object containing array of system labels
**Returns**: Data for all requested systems

---

#### get_filtered_systems(filters)

**Purpose**: Retrieves systems matching specific filter criteria.
**Parameter**: `filters` - Object with all filter settings
**Returns**: Filtered results AND statistics about those results

---

#### get_statistics(filters)

**Purpose**: Gets statistical information about systems matching filters.
**Returns**: Statistics including number of maps, average automorphism cardinality, number of PCF maps, average height, average resultant, postcritical set stats, periodic point stats, and preperiodic point stats

---

#### get_families()

**Purpose**: Retrieves all families of dynamical systems.
**Returns**: Array of family data including ID, name, degree, model coefficients, and field information

---

#### get_family(familyId)

**Purpose**: Gets detailed information about one family.
**Parameter**: `familyId` - The family's unique identifier
**Returns**: Complete family data

---

#### get_rational_periodic_data(functionId)

**Purpose**: Gets rational periodic point data for a specific function.
**Returns**: Periodic point information

---

#### get_label(functionId)

**Purpose**: Gets the label for a function given its ID.
**Returns**: Object containing the label

---

#### get_graph_data(graphId) & get_graph_metadata(graphId)

**Purpose**: Get directed graph data and metadata for visualization.
**Returns**: Graph edges, vertices, and metadata

---

**Uses**:
- None (only axios library)

**Used By**:
- `ExploreSystems.js` - Calls `get_filtered_systems()`, `get_selected_systems()`, `get_families()`
- `Families.js` - Calls `get_families()`
- `FamilyDetails.js` - Calls `get_family()`
- `SystemDetails.js` - Calls `get_system()`
- `InfoTable.js` - Calls `get_filtered_systems()`
- `RationalPointsTable.js` - Calls `get_rational_periodic_data()`, `get_label()`, `get_graph_metadata()`
- `RationalTwistsTable.js` - Calls `get_label()`
- `CriticalPointPortraitTable.js` - Calls `get_graph_data()`

---

## Page Components

### AboutPage.js

**Purpose**: The homepage/landing page that provides background information about the DynaBase project.

**What It Does**:
1. Displays project overview and goals
2. Lists potential users (researchers, mathematicians, scientists, educators, and professionals)
3. Provides sample use cases
4. Shows mathematical background (PDF viewer)
5. Links to the GitHub repository
6. Includes a "scroll to top" button

**Key Features**:

| Feature | Implementation |
|---------|----------------|
| Accordion sections | Uses React Bootstrap `Accordion` for collapsible sections |
| Tab navigation | Uses `Tab.Container` and `ListGroup` for use case examples |
| PDF display | Embeds `PDFViewer` component for mathematical definitions |
| Scroll to top | Button with `window.scrollTo` for smooth scrolling |

**Main Sections**:

1. **About the Project**: Overview and list of potential users
2. **Mathematical Background**: PDF with definitions
3. **Getting Started with DynaBase**: Quick start guide
4. **About the Data**: Section for data source information (currently contains placeholder text in the source code)

**Uses**:
- `PDFViewer.js` - Displays the mathematical background PDF

**Used By**:
- `App.js` - Renders this as the home page (`/` route)

---

### ExploreSystems.js

**Purpose**: The main search and exploration page - the core functionality of the application.

**What It Does**:
1. Displays a sidebar with filter options
2. Shows search results in a paginated table
3. Displays statistics about the filtered results
4. Allows CSV export of search results
5. Preserves pagination state when navigating away

**State Variables** (data that the component tracks):

| Variable | Purpose |
|----------|---------|
| `systems` | Array of systems matching current filters |
| `pagesPer` | Number of results per page |
| `triggerFetch` | Triggers data reload when changed |
| `majorError` / `generalError` | Error messages |
| `stats` | Statistics about filtered results |
| `families` | Available families for the filter dropdown |
| `filtersApplied` | Currently active filters |

**Key Functions**:

#### Handler Functions (respond to user actions):

```javascript
// When user clicks a checkbox filter
handleCheckboxChange(filterName, filterValue)

// When user selects radio button option  
handleRadioChange(filterName, value)

// When user types in a text field
handleTextChange(filterName, value)

// When user selects families in dropdown
handleAutocompleteChange(event, value)

// When user changes results per page
handlePagePerChange(event)

// When user clicks "Apply Filters"
sendFilters()

// When user clicks "Clear Filters"
clearFilters()
```

#### API Functions (get data from server):

```javascript
// Get families for dropdown filter
fetchFamilies()

// Get systems matching current filters
fetchFilteredSystems()

// Download search results as CSV
downloadSearchResults()
```

#### Utility Functions (helper operations):

```javascript
// Show/hide filter categories
toggleTree(event)

// Create and download CSV file
createCSV(csvSystems, fileName)

// Download SageMath helper code
downloadSageCode()

// Parse model data strings
getEntryFromModelString(modelString, index)
```

**Filter Categories Displayed**:

- Dimension (P¹, P², custom)
- Degree (2, 3, 4, custom)
- Type (Polynomial, Lattès, Chebyshev, Newton, PCF)
- Family (dropdown selection)
- Automorphism Group Cardinality
- Base Field Label
- Base Field Degree
- Indeterminacy Locus Dimension
- Critical Points Cardinality
- Periodic Cycles
- Sigma One
- Sigma Two
- Model Label
- Journal Label

**Statistics Displayed**:

| Statistic | Description |
|-----------|-------------|
| numMaps | Total number of maps matching filters |
| avgAUT | Average automorphism group cardinality |
| numPCF | Number of postcritically finite maps |
| avgHeight | Average height |
| avgResultant | Average resultant |
| avgPCSet | Average postcritical set size |
| largestPCSet | Largest postcritical set size |
| avgNumPeriodic | Average number of periodic points |
| mostPeriodic | Maximum number of periodic points |
| largestPeriodicCycle | Largest periodic cycle length |
| avgNumPrePeriodic | Average number of preperiodic points |
| mostPreperiodic | Maximum number of preperiodic points |
| largestComp | Largest component size |

**Uses**:
- `PaginatedDataTable.js` - Displays search results with pagination
- `ActiveFiltersBanner.js` - Shows active filters as chips
- `HelpBox.js` - Provides tooltips for filter explanations
- `ReportGeneralError.js` - Shows minor error notifications
- `ReportMajorError.js` - Shows major error dialogs
- `FilterContext.js` - Stores and retrieves filter state
- `PageContext.js` - Stores and retrieves pagination state
- `routes.js` - Fetches data from backend

**Used By**:
- `App.js` - Renders this for the `/exploreSystems` route

---

### Families.js

**Purpose**: Displays a browsable list of all families of dynamical systems.

**What It Does**:
1. Fetches all families from the backend
2. Displays them in a paginated table
3. Each family ID is clickable and navigates to that family's detail page

**Table Columns**:

| Column | Description |
|--------|-------------|
| Family Id | Clickable link to family details |
| Family Name | Name of the family |
| Degree | Degree of maps in this family |

**Uses**:
- `PaginatedDataTable.js` - Displays families list with pagination
- `FilterContext.js` - Updates family filter when clicking a family
- `routes.js` - Calls `get_families()` to fetch data

**Used By**:
- `App.js` - Renders this for the `/families` route

---

### FamilyDetails.js

**Purpose**: Shows detailed information about a single family.

**What It Does**:
1. Extracts the family ID from the URL
2. Fetches that family's data from the backend
3. Displays multiple information tables

**Contains Two Components**:

1. **FamilyDetailsTable**: Displays the actual data tables
2. **FamilyDetails**: Manages data fetching and loading states

**Tables Displayed**:

| General Information | Name, Degree, Model Coefficients, Field Label, Sigma values |
| Mathematical Properties | Resultant, Is Polynomial, Critical Points, Automorphism Group |
| Citations |

**Uses**:
- `routes.js` - Calls `get_family()` to fetch family data

**Used By**:
- `App.js` - Renders this for the `/family-details/:familyId` route

---

### SystemDetails.js

**Purpose**: Displays comprehensive information about a single dynamical system.

**What It Does**:
1. Extracts the system label from the URL
2. Fetches complete system data from the backend
3. Arranges multiple detail components in a structured layout

**Components Used** (each displays different aspects):

| Component | Information Displayed |
|-----------|----------------------|
| `InfoTable` | Label, Domain, Standard Model, Degree, Field, Family |
| `FunctionAttributes` | Is Newton, Is Polynomial, Is PCF, Is Lattès, Is Chebyshev |
| `RationalTwistsTable` | Links to rational twists of this system |
| `RationalPointsTable` | Rational periodic points and graph data |
| `CriticalPointsTable` | Critical point count and properties |
| `CriticalPointPortraitTable` | Critical point orbit visualization |
| `ModelsTable` | Different model representations |
| `CitationsTable` | Literature references |

**Uses**:
- `InfoTable.js` - Displays basic system info
- `FunctionAttributes.js` - Displays boolean attributes
- `RationalTwistsTable.js` - Shows rational twist links
- `RationalPointsTable.js` - Shows rational periodic points
- `CriticalPointsTable.js` - Shows critical point info
- `CriticalPointPortraitTable.js` - Shows critical point portrait
- `ModelsTable.js` - Shows model representations
- `CitationsTable.js` - Shows citations
- `AutomorphismGroupTable.js` - Shows automorphism group
- `routes.js` - Calls `get_system()` to fetch data

**Used By**:
- `App.js` - Renders this for the `/system/:label` route

---

## UI Components

### Topbar.js

**Purpose**: The navigation bar displayed at the top of every page.

**What It Does**:
1. Shows the "DynaBase" title/logo
2. Provides navigation links to all main pages
3. Stays fixed at the top of the screen

**Contains**:

| Element | Links To |
|---------|----------|
| DynaBase (title) | Home (/) |
| Information | Home (/) |
| Dynamical Systems | /exploreSystems |
| Families | /families |

**Uses**:
- None (only React Router and Material-UI)

**Used By**:
- `App.js` - Displays on every page

---

### Sidebar.js 

**Purpose**: An alternative sidebar navigation component (currently not actively used, but available).

**What It Does**:
1. Provides a permanent side drawer with navigation links
2. Similar functionality to Topbar but in sidebar format

**Uses**:
- None (only React Router and Material-UI)

**Used By**:
- None (available but not currently used)

---

### DataTable.js

**Purpose**: A basic table component for displaying data in rows and columns.

**Props** (inputs it receives):

| Prop | Type | Description |
|------|------|-------------|
| `labels` | Array of strings | Column headers |
| `data` | Array of arrays | Rows of data |

**Uses**:
- None (only React Bootstrap)

**Used By**:
- None (PaginatedDataTable is used instead)

---

### PaginatedDataTable.js

**Purpose**: An enhanced table component that includes page navigation.

**Props**:

| Prop | Type | Description |
|------|------|-------------|
| `labels` | Array | Column headers |
| `data` | Array | All data rows |
| `itemsPerPage` | Number | Rows per page |
| `currentPage` | Number | Current page number |
| `setCurrentPage` | Function | Function to change page |

**Key Logic**:

```javascript
const totalPages = Math.ceil(data.length / itemsPerPage);
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentData = data.slice(indexOfFirstItem, indexOfLastItem);
```

**Special Features**:

1. **Superscript Rendering**: Converts `^2` to actual superscripts (²)
2. **Page Navigation**: First, Previous, Current, Next, Last buttons

**Uses**:
- None (only React Bootstrap)

**Used By**:
- `ExploreSystems.js` - Displays search results
- `Families.js` - Displays families list

---

### ActiveFiltersBanner.js

**Purpose**: Displays the currently active filters as visual "chips" or badges.

**What It Does**:
1. Receives the current filter object
2. Only displays filters that have values
3. Shows each as a labeled chip

**Uses**:
- None (only React)

**Used By**:
- `ExploreSystems.js` - Shows active filters above results

---

### PDFViewer.js

**Purpose**: Displays PDF documents within the application.

**What It Does**:
1. Uses `react-pdf` library to render PDFs
2. Automatically adjusts to parent container width
3. Shows loading spinners while pages load

**Uses**:
- None (only react-pdf library)

**Used By**:
- `AboutPage.js` - Displays mathematical background PDF

---

## FunctionDetail Components

These components are used on the SystemDetails page to display different aspects of a dynamical system.

### InfoTable.js

**Purpose**: Displays basic identifying information about a system.

**Displays**:

| Field | Description |
|-------|-------------|
| Label | Unique identifier (format: N.S1.S2.M) |
| Domain | Ambient domain (P^N → P^N) |
| Standard Model | Representative polynomials |
| Degree | Homogeneous polynomial degree |
| Field of Definition | Smallest coefficient field |
| Family | Link to family this belongs to |

**Special Features**:
- Links to LMFDB (external math database) for field labels
- Dynamically fetches domain from backend
- Formats polynomial expressions with superscripts

**Helper Functions**:

Uses imported functions from ModelsTable:
- `renderExponent()` - Converts ^2 to superscript
- `splitOutermostCommas()` - Parses model strings
- `buildModelString()` - Formats polynomial expression

**Uses**:
- `ModelsTable.js` - Imports helper functions for formatting
- `HelpBox.js` - Provides tooltip explanations
- `routes.js` - Fetches domain information

**Used By**:
- `SystemDetails.js` - Displays basic system info

---

### ModelsTable.js

**Purpose**: Displays different model representations of the same conjugacy class.

**Displays For Each Model**:

| Column | Description |
|--------|-------------|
| Name | Model type (monic centered, reduced, original) |
| Polynomials | Defining polynomials |
| Resultant | Resultant of polynomials |
| Primes of Bad Reduction | Primes dividing resultant |
| Field of Definition | Coefficient field |

**buildModelString Logic**:
1. Creates monomial list (x^d, x^(d-1)y, ..., y^d)
2. Parses coefficient string into 2D array
3. Combines coefficients with monomials
4. Handles plus/minus signs correctly

**Uses**:
- `HelpBox.js` - Provides tooltip explanations

**Used By**:
- `SystemDetails.js` - Displays model representations
- `InfoTable.js` - Imports `renderExponent()`, `splitOutermostCommas()`, `buildModelString()`

---

### InfoTable2.js

**Purpose**: A prototype/static component displaying family membership and rational twists information (uses hardcoded data).

**Status**: This component uses static/hardcoded sample data and is not currently used in production.

**Displays**:

| Section | Description |
|---------|-------------|
| Keywords | Descriptive keywords for the system |
| Member of families | Count and list of families |
| Rational Twists | List of twist labels |

**Uses**:
- None (only Material-UI)

**Used By**:
- None (prototype component with static data)

---

### InfoTable3.js

**Purpose**: A prototype/static component displaying basic system information (uses hardcoded data).

**Status**: This component uses static/hardcoded sample data and is not currently used in production.

**Displays**:

| Field | Description |
|-------|-------------|
| Label | System identifier |
| Domain | Mapping domain (P1 -> P1) |
| Standard Model | Polynomial representation |
| Degree | Polynomial degree |
| Field of Definition | Coefficient field |
| Min Field of Definition | Minimal field |
| Field of Moduli | Field of moduli |

**Uses**:
- None (only Material-UI)

**Used By**:
- None (prototype component with static data)

---

### MultiplierInvariantsTable.js

**Purpose**: Displays multiplier invariants (sigma values) for periodic points.

**Displays**:

| Column | Description |
|--------|-------------|
| Period | The period of the periodic cycle |
| Invariants | Array of sigma invariants for that period |

**Note**: Currently uses static sample data. The component structure is ready to receive dynamic data.

**Uses**:
- `HelpBox.js` - Provides tooltip explanations for Period and Invariants columns

**Used By**:
- None (available for integration)

---

### RationalPointsTable.js

**Purpose**: Displays information about rational periodic points.

**Displays**:

| Column | Description |
|--------|-------------|
| Field Label | Field extension identifier (links to LMFDB) |
| Cardinality | Number of elements in field |
| As Directed Graph | DiGraph visualization |
| Adjacency Matrix | Matrix representation |
| Cycle Lengths | Periodic cycle sizes |
| Component Sizes | Connected component sizes |
| Rational Preperiodic Points | Points becoming periodic |
| Longest Tail | Maximum preperiod length |

**Data Fetching**:
- Calls `get_rational_periodic_data()` for point data
- Calls `get_label()` for system label
- Calls `get_graph_metadata()` for each graph ID

**Uses**:
- `AdjacencyMatrix.js` - Shows matrix in modal
- `Copy.js` - Copies SageMath commands
- `HelpBox.js` - Provides tooltip explanations
- `routes.js` - Fetches graph data

**Used By**:
- `SystemDetails.js` - Displays rational points info

---

### CriticalPointsTable.js

**Purpose**: Shows information about critical points of the map.

**Displays**:

| Field | Description |
|-------|-------------|
| Postcritically Finite? | Whether all critical points are preperiodic |
| Critical Points Cardinality | Number of critical points |
| Field of Definition | Smallest field containing critical points |

**Uses**:
- `HelpBox.js` - Provides tooltip explanations

**Used By**:
- `SystemDetails.js` - Displays critical point info

---

### CriticalPointPortraitTable.js

**Purpose**: Visualizes the forward orbits of critical points as a directed graph.

**Only Displays If**: `data.is_pcf` is true (postcritically finite)

**Displays**:

| Field | Description |
|-------|-------------|
| Cardinality | Vertices in the DiGraph |
| Size of Post Critical Set | Points in critical point orbits |
| As Directed Graph | DiGraph command (with Copy and Show) |
| Adjacency Matrix | Matrix view |
| Cycle Lengths | Periodic component sizes |
| Component Sizes | Preperiodic component sizes |

**Uses**:
- `AdjacencyMatrix.js` - Shows matrix in modal
- `Copy.js` - Copies SageMath commands
- `HelpBox.js` - Provides tooltip explanations
- `routes.js` - Fetches graph data via `get_graph_data()`

**Used By**:
- `SystemDetails.js` - Displays critical point portrait

---

### FunctionAttributes.js

**Purpose**: Shows boolean and categorical attributes of the function.

**Displays**:

| Attribute | Description |
|-----------|-------------|
| Is Newton Function | From Newton's method |
| Newton Polynomial | (if Newton) The original polynomial |
| Is Polynomial | Has totally ramified fixed point |
| Is Postcritically Finite | All critical points preperiodic |
| Is Lattès Function | Special elliptic curve map |
| Is Chebyshev | Chebyshev polynomial |
| Chebyshev Model | (if Chebyshev) The polynomial |
| Automorphism Cardinality | Size of automorphism group |

**Uses**:
- `HelpBox.js` - Provides tooltip explanations

**Used By**:
- `SystemDetails.js` - Displays function attributes

---

### CitationsTable.js

**Purpose**: Displays literature references for the system.

**Logic**:
- Checks if `data.citation_id` exists
- If yes, displays the citation
- If no, shows "No citation available"

**Uses**:
- None (only Material-UI)

**Used By**:
- `SystemDetails.js` - Displays citations

---

### RationalTwistsTable.js

**Purpose**: Shows links to other systems that are rational twists of this one.

**What It Does**:
1. Lists all function IDs in `data.rational_twists`
2. For each ID, fetches its label using `get_label()`
3. Creates clickable links to each twist's detail page

**Uses**:
- `routes.js` - Fetches labels for each twist

**Used By**:
- `SystemDetails.js` - Displays rational twists

---

### AutomorphismGroupTable.js

**Purpose**: Displays information about the automorphism group of the dynamical system.

**Displays**:

| Field | Description |
|-------|-------------|
| Cardinality | Number of elements in the automorphism group |
| Structure | Structure description of the group |
| As Matrices | Matrix representations of automorphisms |
| Field of Definition | Field over which automorphisms are defined |

**Uses**:
- `HelpBox.js` - Provides tooltip for cardinality explanation

**Used By**:
- `SystemDetails.js` - Displays automorphism group info

---

### HelpBox.js

**Purpose**: Provides tooltip help icons with explanatory text.

**Props**:

| Prop | Description |
|------|-------------|
| `title` | Bold heading in tooltip |
| `description` | Explanatory text |

**Implementation**: Uses Material-UI's Tooltip component with a help icon button.

**Uses**:
- None (only Material-UI)

**Used By**:
- `ExploreSystems.js` - Filter tooltips
- `InfoTable.js` - Column tooltips
- `ModelsTable.js` - Column tooltips
- `RationalPointsTable.js` - Column tooltips
- `CriticalPointsTable.js` - Row tooltips
- `CriticalPointPortraitTable.js` - Row tooltips
- `FunctionAttributes.js` - Attribute tooltips
- `AutomorphismGroupTable.js` - Row tooltips

---

### Copy.js

**Purpose**: Provides buttons to copy SageMath commands to clipboard and visualize graphs.

**Props**:

| Prop | Description |
|------|-------------|
| `edges` | Edge data as string |
| `type` | 1 = Matrix command, 2 = DiGraph command |

**Output Formats**:

- Type 1: `Matrix(QQ, n, n, [matrix values])`
- Type 2: `DiGraph(Matrix(QQ, n, n, [matrix values]))`

**Features**:
- "Copy Sage Command" button
- "Show" button (type 2 only) opens graph visualization modal

**Uses**:
- `SageMathCell.js` - Embeds interactive SageMath cell for graph visualization

**Used By**:
- `RationalPointsTable.js` - Copy/show graph data
- `CriticalPointPortraitTable.js` - Copy/show portrait data

---

### AdjacencyMatrix.js

**Purpose**: Displays an adjacency matrix in a modal popup.

**What It Does**:
1. Converts edge string to adjacency matrix
2. Formats matrix as readable text grid
3. Shows in a Bootstrap modal when "Show" is clicked

**Uses**:
- None (only React Bootstrap)

**Used By**:
- `RationalPointsTable.js` - Shows adjacency matrix modal
- `CriticalPointPortraitTable.js` - Shows adjacency matrix modal

---

### SageMathCell.js

**Purpose**: Embeds an interactive SageMath computation cell.

**What It Does**:
1. Loads the SageMath embedded cell library
2. Creates an interactive code cell
3. User can click "Compute Graph" to execute code

**Uses**:
- None (loads external SageMath library)

**Used By**:
- `Copy.js` - Embeds for graph visualization

---

## Error Handling Components

### ReportGeneralError.js

**Purpose**: Shows minor error notifications as brief toast messages.

**Uses**: Material-UI Snackbar that appears briefly at bottom of screen.

**Props**:

| Prop | Description |
|------|-------------|
| `open` | Whether to show the message |
| `onClose` | Function to call when closing |
| `errorMessage` | The error text to display |

**Uses**:
- None (only Material-UI)

**Used By**:
- `ExploreSystems.js` - Shows minor errors (e.g., "Nothing to download")

---

### ReportMajorError.js

**Purpose**: Shows major errors in a modal dialog requiring user acknowledgment.

**Uses**: Material-UI Dialog that blocks interaction until closed.

**Props**:

| Prop | Description |
|------|-------------|
| `open` | Whether dialog is visible |
| `onClose` | Function when user clicks Close |
| `errorMessage` | Error description |

**Uses**:
- None (only Material-UI)

**Used By**:
- `ExploreSystems.js` - Shows major errors (e.g., connection failures)

---

## How Everything Connects Together

### Application Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         index.js                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   FilterProvider                         │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │                 PageProvider                     │    │   │
│  │  │  ┌─────────────────────────────────────────┐    │    │   │
│  │  │  │                  App.js                  │    │    │   │
│  │  │  │  ┌────────────────────────────────────┐ │    │    │   │
│  │  │  │  │              Topbar                 │ │    │    │   │
│  │  │  │  └────────────────────────────────────┘ │    │    │   │
│  │  │  │  ┌────────────────────────────────────┐ │    │    │   │
│  │  │  │  │           Routes (Pages)           │ │    │    │   │
│  │  │  │  │  - AboutPage                       │ │    │    │   │
│  │  │  │  │  - ExploreSystems                  │ │    │    │   │
│  │  │  │  │  - Families                        │ │    │    │   │
│  │  │  │  │  - SystemDetails                   │ │    │    │   │
│  │  │  │  │  - FamilyDetails                   │ │    │    │   │
│  │  │  │  └────────────────────────────────────┘ │    │    │   │
│  │  │  └─────────────────────────────────────────┘    │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow: Search and Filter

```
User Action                    Component                    Backend
────────────────────────────────────────────────────────────────────
1. User checks                 ExploreSystems.js
   "Degree 2" checkbox         handleCheckboxChange()
                                    │
                                    ▼
                               FilterContext
                               (stores filters globally)
                                    │
2. User clicks                      ▼
   "Apply Filters"             sendFilters()
                                    │
                                    ▼
                               fetchFilteredSystems()
                                    │
                                    ▼
                               routes.js
                               get_filtered_systems()  ─────────►  Backend API
                                    │                               /get_filtered_systems
                                    ▼
                               Receives results  ◄──────────────────┘
                                    │
                                    ▼
                               setSystems(results)
                               setStat(statistics)
                                    │
3. Results displayed                ▼
                               PaginatedDataTable
                               (shows filtered systems)
```

### Data Flow: Viewing System Details

```
User Action                    Component                    Backend
────────────────────────────────────────────────────────────────────
1. User clicks                 ExploreSystems
   system label                (Link component)
        │
        ▼
   URL changes to
   /system/1.2.3.4
        │
        ▼
2. App.js routes              SystemDetails.js
   to SystemDetails                 │
                                    ▼
                               useParams() extracts
                               label from URL
                                    │
                                    ▼
                               fetchDataForCSV()
                                    │
                                    ▼
                               routes.js
                               get_system(label)  ──────────────►  Backend API
                                    │                               /get_system
                                    ▼
                               setData(result.data)  ◄──────────────┘
                                    │
3. Data passed to                   ▼
   child components           InfoTable(data)
                              FunctionAttributes(data)
                              RationalPointsTable(data)
                              CriticalPointsTable(data)
                              ModelsTable(data)
                              CitationsTable(data)
                                    │
                                    ▼
                              Each component renders
                              its portion of the data
```

### Component Relationships

```
                                App.js
                                   │
           ┌───────────────────────┼───────────────────────┐
           │                       │                       │
        Topbar              ExploreSystems            SystemDetails
           │                       │                       │
      PageLinks            ┌───────┴───────┐       ┌───────┴───────┐
                           │               │       │               │
                    PaginatedDataTable  Filters  InfoTable    ModelsTable
                           │               │       │               │
                      Pagination      HelpBox   HelpBox      renderExponent
                                           │               buildModelString
                                    ActiveFiltersBanner
```

### Context Usage Across Components

```
FilterContext                              PageContext
    │                                          │
    ├── ExploreSystems.js                     ├── ExploreSystems.js
    │   (reads/writes filters)                │   (reads/writes page)
    │                                          │
    └── Families.js                           └── (used for pagination
        (writes family filter                      when navigating)
         when clicking family)
```

---

## Summary

The DynaBase frontend is a React application organized into:

1. **Core Files**: `index.js` starts the app, `App.js` handles routing
2. **Context**: Global state for filters and pagination
3. **API Layer**: `routes.js` communicates with the backend
4. **Pages**: Full-page components for different views
5. **Components**: Reusable UI pieces
6. **FunctionDetail**: Specialized components for system data display
7. **Error Handling**: User-friendly error notifications

The application follows a unidirectional data flow:
- User interactions trigger state updates
- State changes cause API calls
- API responses update component state
- React re-renders affected components

This architecture makes the code maintainable and allows components to be reused across different parts of the application.
