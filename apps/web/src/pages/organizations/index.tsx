import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Autocomplete from '@mui/material/Autocomplete';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';

const API = 'http://localhost:3000';

interface ContactLink { contact: { id: number; firstName: string; lastName: string } }
interface Organization {
  id: number;
  name: string;
  website: string | null;
  industry: string | null;
  contacts: ContactLink[];
}
interface ContactOption { id: number; firstName: string; lastName: string }

const EMPTY_CREATE = { name: '', website: '', industry: '' };

export default function OrganizationsPage() {
  // ── List ──────────────────────────────────────────────────────────────────
  const [rows, setRows] = useState<Organization[]>([]);
  const [listLoading, setListLoading] = useState(true);

  async function fetchOrgs() {
    setListLoading(true);
    const res = await fetch(`${API}/organizations`, { credentials: 'include' });
    if (res.ok) setRows(await res.json());
    setListLoading(false);
  }
  useEffect(() => { fetchOrgs(); }, []);

  // ── Action menu ───────────────────────────────────────────────────────────
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [activeRow, setActiveRow] = useState<Organization | null>(null);

  function closeMenu() { setMenuAnchor(null); }

  // ── Create ────────────────────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_CREATE);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  function closeCreate() { setCreateOpen(false); setCreateForm(EMPTY_CREATE); setCreateError(null); }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);
    try {
      const res = await fetch(`${API}/organizations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: createForm.name,
          website: createForm.website || undefined,
          industry: createForm.industry || undefined,
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message ?? 'Erreur');
      closeCreate();
      fetchOrgs();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setCreateLoading(false);
    }
  }

  // ── Update ────────────────────────────────────────────────────────────────
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateForm, setUpdateForm] = useState({ name: '', website: '', industry: '' });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  function openUpdate() {
    if (!activeRow) return;
    setUpdateForm({
      name: activeRow.name,
      website: activeRow.website ?? '',
      industry: activeRow.industry ?? '',
    });
    setUpdateOpen(true);
    closeMenu();
  }

  function closeUpdate() { setUpdateOpen(false); setUpdateError(null); }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!activeRow) return;
    setUpdateLoading(true);
    setUpdateError(null);
    try {
      const res = await fetch(`${API}/organizations/${activeRow.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: updateForm.name,
          website: updateForm.website || undefined,
          industry: updateForm.industry || undefined,
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message ?? 'Erreur');
      closeUpdate();
      fetchOrgs();
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setUpdateLoading(false);
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  function openDelete() { setDeleteOpen(true); closeMenu(); }
  function closeDelete() { setDeleteOpen(false); }

  async function handleDelete() {
    if (!activeRow) return;
    setDeleteLoading(true);
    await fetch(`${API}/organizations/${activeRow.id}`, { method: 'DELETE', credentials: 'include' });
    setDeleteLoading(false);
    closeDelete();
    fetchOrgs();
  }

  // ── Link to contact ───────────────────────────────────────────────────────
  const [linkOpen, setLinkOpen] = useState(false);
  const [contactOptions, setContactOptions] = useState<ContactOption[]>([]);
  const [linkTarget, setLinkTarget] = useState<ContactOption | null>(null);
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  async function openLink() {
    closeMenu();
    const res = await fetch(`${API}/contacts`, { credentials: 'include' });
    const all: ContactOption[] = res.ok ? await res.json() : [];
    const linkedIds = new Set(activeRow?.contacts.map((c) => c.contact.id) ?? []);
    setContactOptions(all.filter((c) => !linkedIds.has(c.id)));
    setLinkTarget(null);
    setLinkError(null);
    setLinkOpen(true);
  }

  function closeLink() { setLinkOpen(false); setLinkError(null); }

  async function handleLink() {
    if (!activeRow || !linkTarget) return;
    setLinkLoading(true);
    setLinkError(null);
    try {
      const res = await fetch(`${API}/organizations/${activeRow.id}/contacts/${linkTarget.id}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message ?? 'Erreur');
      closeLink();
      fetchOrgs();
    } catch (err) {
      setLinkError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLinkLoading(false);
    }
  }

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns = useMemo<GridColDef<Organization>[]>(() => [
    {
      field: '__actions__',
      headerName: '',
      width: 48,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(e) => { setActiveRow(params.row); setMenuAnchor(e.currentTarget); }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ),
    },
    { field: 'id', headerName: 'ID', width: 60 },
    { field: 'name', headerName: 'Nom', flex: 1.5, minWidth: 160 },
    { field: 'website', headerName: 'Site web', flex: 1.5, minWidth: 160 },
    { field: 'industry', headerName: "Secteur d'activité", flex: 1.5, minWidth: 160 },
    {
      field: 'contacts',
      headerName: 'Contacts',
      flex: 1.5,
      minWidth: 160,
      sortable: false,
      renderCell: (params) =>
        params.row.contacts
          .map((c: ContactLink) => `${c.contact.firstName} ${c.contact.lastName}`)
          .join(', ') || '—',
    },
  ], []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Button variant="contained" startIcon={<AddBusinessIcon />} onClick={() => setCreateOpen(true)} disableElevation>
          Ajouter une organisation
        </Button>
      </Box>

      <DataGrid
        rows={rows}
        columns={columns}
        loading={listLoading}
        autoHeight
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
      />

      {/* Action menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
        <MenuItem onClick={openUpdate}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Modifier</ListItemText>
        </MenuItem>
        <MenuItem onClick={openLink}>
          <ListItemIcon><LinkIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Lier à un contact</ListItemText>
        </MenuItem>
        <MenuItem onClick={openDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>Supprimer</ListItemText>
        </MenuItem>
      </Menu>

      {/* Create modal */}
      <Dialog open={createOpen} onClose={closeCreate} fullWidth maxWidth="sm">
        <form onSubmit={handleCreate}>
          <DialogTitle>Nouvelle organisation</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="Nom" value={createForm.name}
                onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))}
                required fullWidth autoFocus />
              <TextField label="Site web" value={createForm.website}
                onChange={(e) => setCreateForm((p) => ({ ...p, website: e.target.value }))}
                fullWidth />
              <TextField label="Secteur d'activité" value={createForm.industry}
                onChange={(e) => setCreateForm((p) => ({ ...p, industry: e.target.value }))}
                fullWidth />
              {createError && <Typography color="error" variant="body2">{createError}</Typography>}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={closeCreate} disabled={createLoading}>Annuler</Button>
            <Button type="submit" variant="contained" disabled={createLoading} disableElevation>
              {createLoading ? 'Création…' : 'Créer'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Update modal */}
      <Dialog open={updateOpen} onClose={closeUpdate} fullWidth maxWidth="sm">
        <form onSubmit={handleUpdate}>
          <DialogTitle>Modifier l'organisation</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="ID" value={activeRow?.id ?? ''} disabled fullWidth />
              <TextField label="Nom" value={updateForm.name}
                onChange={(e) => setUpdateForm((p) => ({ ...p, name: e.target.value }))}
                required fullWidth />
              <TextField label="Site web" value={updateForm.website}
                onChange={(e) => setUpdateForm((p) => ({ ...p, website: e.target.value }))}
                fullWidth />
              <TextField label="Secteur d'activité" value={updateForm.industry}
                onChange={(e) => setUpdateForm((p) => ({ ...p, industry: e.target.value }))}
                fullWidth />
              {updateError && <Typography color="error" variant="body2">{updateError}</Typography>}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={closeUpdate} disabled={updateLoading}>Annuler</Button>
            <Button type="submit" variant="contained" disabled={updateLoading} disableElevation>
              {updateLoading ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete modal */}
      <Dialog open={deleteOpen} onClose={closeDelete} maxWidth="xs" fullWidth>
        <DialogTitle>Supprimer l'organisation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Supprimer <strong>{activeRow?.name}</strong> ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDelete} disabled={deleteLoading}>Annuler</Button>
          <Button variant="contained" color="error" onClick={handleDelete} disabled={deleteLoading} disableElevation>
            {deleteLoading ? 'Suppression…' : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Link modal */}
      <Dialog open={linkOpen} onClose={closeLink} fullWidth maxWidth="xs">
        <DialogTitle>Lier à un contact</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Autocomplete
              options={contactOptions}
              getOptionLabel={(c) => `${c.firstName} ${c.lastName}`}
              value={linkTarget}
              onChange={(_, val) => setLinkTarget(val)}
              renderInput={(params) => <TextField {...params} label="Contact" />}
              noOptionsText="Aucun contact disponible"
            />
            {linkError && <Typography color="error" variant="body2">{linkError}</Typography>}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeLink} disabled={linkLoading}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleLink}
            disabled={linkLoading || !linkTarget}
            disableElevation
          >
            {linkLoading ? 'Liaison…' : 'Lier'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
