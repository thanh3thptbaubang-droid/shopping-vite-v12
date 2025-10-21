import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { motion } from 'framer-motion';

export default function AdminPanel() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [commissionRate, setCommissionRate] = useState(0.08);
  const [editingRate, setEditingRate] = useState(false);
  const [adminWallet, setAdminWallet] = useState(null);

  const columns = [
    { field: 'uid', headerName: 'UID', width: 200 },
    { field: 'name', headerName: 'Tên đại lý', width: 200 },
    { field: 'email', headerName: 'Email', width: 220 },
    { field: 'status', headerName: 'Trạng thái', width: 150 },
    { field: 'createdAt', headerName: 'Ngày tạo', width: 180 },
  ];

  useEffect(() => {
    loadPending();
    loadAdminWallet();
  }, []);

  async function loadPending() {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, 'sellers'));
      const data = snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
      setRequests(data);
      const statsData = {
        total: data.length,
        pending: data.filter((r) => r.status === 'pending').length,
        approved: data.filter((r) => r.status === 'approved').length,
        rejected: data.filter((r) => r.status === 'rejected').length,
      };
      setStats(statsData);
    } catch (e) {
      console.error('Lỗi tải dữ liệu:', e);
    } finally {
      setLoading(false);
    }
  }

  async function loadAdminWallet() {
    try {
      const ref = doc(db, 'wallets', 'admin');
      const snap = await getDoc(ref);
      if (snap.exists()) setAdminWallet(snap.data());
    } catch (e) {
      console.error('Không thể tải ví admin:', e);
    }
  }

  async function saveCommissionRate() {
    try {
      const ref = doc(db, 'settings', 'platform');
      await updateDoc(ref, { commissionRate: parseFloat(commissionRate) });
      alert('Đã cập nhật tỉ lệ hoa hồng nền tảng');
      setEditingRate(false);
    } catch (e) {
      alert('Lỗi khi cập nhật: ' + e.message);
    }
  }

  const filtered = requests.filter((r) => {
    const matchText =
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filter === 'all' || r.status === filter;
    return matchText && matchStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Container sx={{ py: 3 }}>
        <Typography variant="h5" gutterBottom>
          Admin Dashboard
        </Typography>

        {adminWallet && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">
              Admin Wallet Balance:{' '}
              {adminWallet.balance?.toLocaleString?.() ??
                adminWallet.balance}{' '}
              ₫
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip label={`Tổng: ${stats.total}`} />
            <Chip label={`Chờ: ${stats.pending}`} color="warning" />
            <Chip label={`Đã duyệt: ${stats.approved}`} color="success" />
            <Chip label={`Từ chối: ${stats.rejected}`} color="error" />

            <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">
                Tỉ lệ hoa hồng nền tảng:
              </Typography>
              {!editingRate ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">
                    {(commissionRate * 100).toFixed(2)}%
                  </Typography>
                  <Button size="small" onClick={() => setEditingRate(true)}>
                    Sửa
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    style={{ width: 100, padding: 6 }}
                  />
                  <Button
                    size="small"
                    variant="contained"
                    onClick={saveCommissionRate}
                  >
                    Lưu
                  </Button>
                  <Button size="small" onClick={() => setEditingRate(false)}>
                    Hủy
                  </Button>
                </Box>
              )}
            </Box>
          </Box>

          <Box sx={{ flex: 1 }} />
          <TextField
            size="small"
            placeholder="Tìm kiếm theo tên hoặc email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <TextField
            select
            size="small"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            SelectProps={{ native: true }}
            sx={{ width: 160, ml: 1 }}
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Bị từ chối</option>
          </TextField>
          <Button variant="outlined" onClick={loadPending} sx={{ ml: 1 }}>
            Làm mới
          </Button>
        </Box>

        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filtered}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            loading={loading}
            getRowId={(r) => r.uid}
          />
        </div>
      </Container>
    </motion.div>
  );
}
