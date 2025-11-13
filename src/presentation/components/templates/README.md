# Templates

Templates are page-level layouts that define the structure and arrangement of organisms, molecules, and atoms. They are concrete instances of page structures without real data.

## Characteristics

- **Page-Level Structure**: Define overall page layout
- **Data-Agnostic**: Structure without real content
- **Reusable**: Same template for multiple pages
- **Responsive**: Adapt to different screen sizes
- **Composition**: Built from organisms, molecules, and atoms

## Examples

- DashboardTemplate
- ProfileTemplate
- LeaderboardTemplate
- SettingsTemplate
- AuthTemplate (Login/Signup)
- ErrorTemplate (404, 500)
- SearchResultsTemplate

## Usage Guidelines

1. **Focus on Structure**: Define layout and placement
2. **Use Grid Systems**: Leverage CSS Grid or Flexbox
3. **Responsive Design**: Mobile-first approach
4. **Content Slots**: Provide clear slots for content
5. **Consistent Patterns**: Reuse common layout patterns

## Template Example

```typescript
export function DashboardTemplate({
  sidebar,
  header,
  mainContent,
  widgets,
}: DashboardTemplateProps) {
  return (
    <div className="dashboard-template">
      <Header>{header}</Header>
      <div className="dashboard-layout">
        <Sidebar>{sidebar}</Sidebar>
        <Main>
          <Content>{mainContent}</Content>
          <Widgets>{widgets}</Widgets>
        </Main>
      </div>
    </div>
  );
}
```

## Story Organization

Each template story should show:
- With placeholder content
- With real component examples
- Different viewport sizes
- Different content scenarios
- Loading states

## File Structure

```
templates/
├── DashboardTemplate/
│   ├── DashboardTemplate.tsx
│   ├── DashboardTemplate.stories.tsx
│   ├── DashboardTemplate.test.tsx
│   ├── styles.module.css     # Template-specific styles
│   └── index.ts
└── ...
```

## Layout Patterns

### Two-Column Layout
```
+------------------+
|     Header       |
+------+-----------+
| Side |   Main    |
| bar  |  Content  |
|      |           |
+------+-----------+
```

### Dashboard Grid
```
+------------------+
|     Header       |
+--+--+--+--+--+--+
|W |W |W |W |W |W |
|i |i |i |i |i |i |
|d |d |d |d |d |d |
|g |g |g |g |g |g |
|e |e |e |e |e |e |
|t |t |t |t |t |t |
+--+--+--+--+--+--+
```

### Centered Content
```
+------------------+
|     Header       |
+------------------+
|                  |
|    +--------+    |
|    | Content|    |
|    +--------+    |
|                  |
+------------------+
```

