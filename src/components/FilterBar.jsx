import { Button, FormControl, MenuItem, Select } from '@mui/material';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';

const defaults = {
  categories: [
    'Slat Panels',
    'Flat Panels',
    'Wooden Panels',
    'Marble Panels',
    'PVC Panels',
    '3D Panels',
    'Textured Panels',
  ],

  colors: [
    'White',
    'Pearl White',
    'White Grey',
    'Black',
    'Matte Black',
    'Grey',
    'Light Grey',
    'Concrete Grey',
    'Silver',
    'Bronze',
    'Cream',
    'Beige',
    'Sand Beige',
    'Brown',
    'Dark Brown',
    'Chocolate Brown',
    'Oak Brown',
    'Light Oak',
    'Golden Oak',
    'Walnut Brown',
    'Dark Walnut',
    'Deep Walnut',
    'Bamboo',
    'Charcoal Black',
  ],

  styles: [
    'Modern',
    'Luxury',
    'Minimal',
    'Cozy',
    'Elegant',
    'Rustic',
    'Scandinavian',
    'Industrial',
    'Professional',
    'Natural',
  ],
};

function FilterSelect({ label, value, options, onChange }) {
  return (
    <FormControl fullWidth size="small">
      {/* Remove <InputLabel> entirely */}
      <Select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        displayEmpty
        renderValue={(selected) => {
          if (selected === '') return `All ${label}`; // e.g. "All Categories"
          return selected;
        }}
        sx={{
          color: 'var(--text-primary)',
          bgcolor: 'rgba(15,52,96,0.36)',
          '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(233,69,96,0.5)' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--accent)' },
          '.MuiSvgIcon-root': { color: 'var(--text-secondary)' },
        }}
        MenuProps={{ slotProps: { paper: { sx: { bgcolor: 'var(--primary)', color: 'var(--text-primary)' } } } }}
      >
        <MenuItem value="">All {label}</MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export function FilterBar({ category, color, style, options = {}, onCategoryChange, onColorChange, onStyleChange, onClear }) {
  const categories = options.categories?.length ? options.categories : defaults.categories;
  const colors = options.colors?.length ? options.colors : defaults.colors;
  const styles = options.styles?.length ? options.styles : defaults.styles;

  return (
    <div className="glass-panel grid gap-4 rounded-lg p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
      <FilterSelect label="Categories" value={category} options={categories} onChange={onCategoryChange} />
      <FilterSelect label="Colors" value={color} options={colors} onChange={onColorChange} />
      <FilterSelect label="Styles" value={style} options={styles} onChange={onStyleChange} />
      <Button
        variant="contained"
        startIcon={<FilterAltOffIcon />}
        onClick={onClear}
        sx={{
          minHeight: 40,
          bgcolor: 'var(--accent)',
          '&:hover': { bgcolor: 'var(--accent-hover)' },
        }}
      >
        Clear Filters
      </Button>
    </div>
  );
}
