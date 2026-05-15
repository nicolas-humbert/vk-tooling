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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';

const API = 'http://localhost:3000';

interface OrgLink { organization: { id: number; name: string } }
interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  createdAt: string;
  organizations: OrgLink[];
}
interface OrgOption { id: number; name: string }

const EMPTY_CREATE = { firstName: '', lastName: '', email: '', phone: '' };

export default function ContactsPage() {
  // ── List ──────────────────────────────────────────────────────────────────
  const [rows, setRows] = useState<Contact[]>([]);
  const [listLoading, setListLoading] = useState(true);

  async function fetchContacts() {
    setListLoading(true);
    const res = await fetch(`${API}/contacts`, { credentials: 'include' });
    if (res.ok) setRows(await res.json());
    setListLoading(false);
  }
  useEffect(() => { fetchContacts(); }, []);

  // ── Action menu ───────────────────────────────────────────────────────────
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [activeRow, setActiveRow] = useState<Contact | null>(null);

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
      const res = await fetch(`${API}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          firstName: createForm.firstName,
          lastName: createForm.lastName,
          email: createForm.email || undefined,
          phone: createForm.phone || undefined,
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message ?? 'Erreur');
      closeCreate();
      fetchContacts();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setCreateLoading(false);
    }
  }

  // ── Update ────────────────────────────────────────────────────────────────
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateForm, setUpdateForm] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  function openUpdate() {
    if (!activeRow) return;
    setUpdateForm({
      firstName: activeRow.firstName,
      lastName: activeRow.lastName,
      email: activeRow.email ?? '',
      phone: activeRow.phone ?? '',
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
      const res = await fetch(`${API}/contacts/${activeRow.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          firstName: updateForm.firstName,
          lastName: updateForm.lastName,
          email: updateForm.email || undefined,
          phone: updateForm.phone || undefined,
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message ?? 'Erreur');
      closeUpdate();
      fetchContacts();
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
    await fetch(`${API}/contacts/${activeRow.id}`, { method: 'DELETE', credentials: 'include' });
    setDeleteLoading(false);
    closeDelete();
    fetchContacts();
  }

  // ── Link to org ───────────────────────────────────────────────────────────
  const [linkOpen, setLinkOpen] = useState(false);
  const [orgOptions, setOrgOptions] = useState<OrgOption[]>([]);
  const [linkTarget, setLinkTarget] = useState<OrgOption | null>(null);
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  async function openLink() {
    closeMenu();
    const res = await fetch(`${API}/organizations`, { credentials: 'include' });
    const all: OrgOption[] = res.ok ? await res.json() : [];
    const linkedIds = new Set(activeRow?.organizations.map((o) => o.organization.id) ?? []);
    setOrgOptions(all.filter((o) => !linkedIds.has(o.id)));
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
      const res = await fetch(`${API}/contacts/${activeRow.id}/organizations/${linkTarget.id}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message ?? 'Erreur');
      closeLink();
      fetchContacts();
    } catch (err) {
      setLinkError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLinkLoading(false);
    }
  }

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns = useMemo<GridColDef<Contact>[]>(() => [
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
    { field: 'firstName', headerName: 'Prénom', flex: 1, minWidth: 120 },
    { field: 'lastName', headerName: 'Nom', flex: 1, minWidth: 120 },
    { field: 'email', headerName: 'Email', flex: 1.5, minWidth: 180 },
    { field: 'phone', headerName: 'Téléphone', width: 140 },
    {
      field: 'organizations',
      headerName: 'Organisations',
      flex: 1.5,
      minWidth: 160,
      sortable: false,
      renderCell: (params) =>
        params.row.organizations.map((o: OrgLink) => o.organization.name).join(', ') || '—',
    },
    {
      field: 'createdAt',
      headerName: 'Créé le',
      width: 110,
      valueFormatter: (value: string) => new Date(value).toLocaleDateString('fr-FR'),
    },
  ], []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setCreateOpen(true)} disableElevation>
          Ajouter un contact
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
          <ListItemText>Lier à une organisation</ListItemText>
        </MenuItem>
        <MenuItem onClick={openDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>Supprimer</ListItemText>
        </MenuItem>
      </Menu>

      {/* Create modal */}
      <Dialog open={createOpen} onClose={closeCreate} fullWidth maxWidth="sm">
        <form onSubmit={handleCreate}>
          <DialogTitle>Nouveau contact</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Stack direction="row" spacing={2}>
                <TextField name="firstName" label="Prénom" value={createForm.firstName}
                  onChange={(e) => setCreateForm((p) => ({ ...p, firstName: e.target.value }))}
                  required fullWidth autoFocus />
                <TextField name="lastName" label="Nom" value={createForm.lastName}
                  onChange={(e) => setCreateForm((p) => ({ ...p, lastName: e.target.value }))}
                  required fullWidth />
              </Stack>
              <TextField name="email" label="Email" type="email" value={createForm.email}
                onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))}
                fullWidth />
              <TextField name="phone" label="Téléphone" value={createForm.phone}
                onChange={(e) => setCreateForm((p) => ({ ...p, phone: e.target.value }))}
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
          <DialogTitle>Modifier le contact</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="ID" value={activeRow?.id ?? ''} disabled fullWidth />
              <Stack direction="row" spacing={2}>
                <TextField label="Prénom" value={updateForm.firstName}
                  onChange={(e) => setUpdateForm((p) => ({ ...p, firstName: e.target.value }))}
                  required fullWidth />
                <TextField label="Nom" value={updateForm.lastName}
                  onChange={(e) => setUpdateForm((p) => ({ ...p, lastName: e.target.value }))}
                  required fullWidth />
              </Stack>
              <TextField label="Email" type="email" value={updateForm.email}
                onChange={(e) => setUpdateForm((p) => ({ ...p, email: e.target.value }))}
                fullWidth />
              <TextField label="Téléphone" value={updateForm.phone}
                onChange={(e) => setUpdateForm((p) => ({ ...p, phone: e.target.value }))}
                fullWidth />
              <TextField
                label="Créé le"
                value={activeRow ? new Date(activeRow.createdAt).toLocaleDateString('fr-FR') : ''}
                disabled fullWidth />
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
        <DialogTitle>Supprimer le contact</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Supprimer <strong>{activeRow?.firstName} {activeRow?.lastName}</strong> ? Cette action est irréversible.
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
        <DialogTitle>Lier à une organisation</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Autocomplete
              options={orgOptions}
              getOptionLabel={(o) => o.name}
              value={linkTarget}
              onChange={(_, val) => setLinkTarget(val)}
              renderInput={(params) => <TextField {...params} label="Organisation" />}
              noOptionsText="Aucune organisation disponible"
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
