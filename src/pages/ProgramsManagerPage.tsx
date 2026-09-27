import React, { useEffect, useState } from 'react';
import { AdminApi } from '../services/adminApi';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  ExternalLink,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ImagePlus,
  Upload
} from 'lucide-react';

export const ProgramsManagerPage: React.FC = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    tagline: '',
    description: '',
    icon: 'GraduationCap',
    imageUrl: '',
    colorTheme: '#2563EB',
    bgGradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    displayOrder: 1,
    active: true,
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      const data = await AdminApi.getPrograms();
      setPrograms(data);
    } catch (err) {
      console.error('Failed to load programs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingProgram(null);
    setFormData({
      name: '',
      slug: '',
      tagline: '',
      description: '',
      icon: 'HeartHandshake',
      imageUrl: '',
      colorTheme: '#0D5C63',
      bgGradient: 'linear-gradient(135deg, #094449 0%, #1A8A8F 100%)',
      displayOrder: programs.length + 1,
      active: true,
    });
    setSelectedImage(null);
    setImagePreview('');
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (prog: any) => {
    setEditingProgram(prog);
    setFormData({
      name: prog.name,
      slug: prog.slug,
      tagline: prog.tagline,
      description: prog.description,
      icon: prog.icon,
      imageUrl: prog.imageUrl || '',
      colorTheme: prog.colorTheme,
      bgGradient: prog.bgGradient,
      displayOrder: prog.displayOrder,
      active: prog.active,
    });
    setSelectedImage(null);
    setImagePreview(prog.imageUrl || '');
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleToggleActive = async (id: number) => {
    try {
      await AdminApi.toggleProgramActive(id);
      loadPrograms();
    } catch (err) {
      alert('Failed to toggle program status');
    }
  };

  const handleDelete = async (prog: any) => {
    if (!window.confirm(`Are you sure you want to delete the program "${prog.name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await AdminApi.deleteProgram(prog.id);
      loadPrograms();
    } catch (err) {
      alert('Failed to delete program');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    try {
      let programData = formData;
      if (selectedImage) {
        const uploadResponse = await AdminApi.uploadProgramImage(selectedImage);
        programData = { ...formData, imageUrl: uploadResponse.imageUrl };
      }
      if (editingProgram) {
        await AdminApi.updateProgram(editingProgram.id, programData);
      } else {
        await AdminApi.createProgram(programData);
      }
      setModalOpen(false);
      loadPrograms();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to save program.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image must be 5 MB or smaller.');
      return;
    }
    setErrorMsg('');
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Generate slug dynamically from name
  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData(prev => ({
      ...prev,
      name,
      slug: editingProgram ? prev.slug : slug
    }));
  };

  return (
    <div>
      <div className="table-card">
        <div className="table-header">
          <div className="table-title">
            <h2>Active & Inactive NGO Programs</h2>
            <p>Live synchronized with the public website's Programs page</p>
          </div>
          <div className="table-actions">
            <button className="btn btn-primary" onClick={handleOpenCreateModal}>
              <Plus size={18} />
              Add New Program
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <span>Loading...</span>
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Program</th>
                <th>Slug</th>
                <th>Image</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((prog) => (
                <tr key={prog.id}>
                  <td style={{ fontWeight: 700, color: '#718096' }}>#{prog.displayOrder}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {prog.imageUrl ? (
                        <img src={prog.imageUrl} alt={prog.name} className="program-manager-image" />
                      ) : <div 
                        style={{
                          width: '36px', 
                          height: '36px', 
                          borderRadius: '8px', 
                          background: prog.colorTheme,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: '0.8rem'
                        }}
                      >
                        {prog.name.charAt(0)}
                      </div>}
                      <div>
                        <div style={{ fontWeight: 600 }}>{prog.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#718096', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {prog.tagline}
                        </div>
                      </div>
                    </div>
                  </td>   
                  <td>   
                    <code style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>
                      /{prog.slug}
                    </code>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleActive(prog.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      title="Click to toggle active status"
                    >
                      {prog.active ? (
                        <span className="badge badge-success">
                          <CheckCircle2 size={12} /> Active
                        </span>
                      ) : (
                        <span className="badge badge-neutral">
                          <XCircle size={12} /> Inactive
                        </span>
                      )}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <a 
                        href={`http://localhost:5174/programs/${prog.slug}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="btn btn-outline btn-sm"
                        title="View Public Page"
                      >
                        <ExternalLink size={14} />
                      </a>
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => handleOpenEditModal(prog)}
                        title="Edit Program"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button 
                        className="btn btn-danger-outline btn-sm"
                        onClick={() => handleDelete(prog)}
                        title="Delete Program"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Program Create / Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProgram ? `Edit Program: ${editingProgram.name}` : 'Add New NGO Program'}</h3>
              <button 
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#718096' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {errorMsg && (
                  <div style={{ padding: '12px', background: '#FEF2F2', color: '#DC2626', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
                    {errorMsg}
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label>Program Name *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g. Clean Water Initiative"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>URL Slug *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="e.g. clean-water"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Tagline / Short Summary *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="e.g. Bringing sustainable safe water to rural families"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Full Description (Markdown or Text) *</label>
                  <textarea 
                    className="form-control" 
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed explanation of the program mission, community reach, and implementation..."
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Lucide Icon Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="e.g. Droplets, HeartPulse, GraduationCap"
                    />
                  </div>

                  <div className="form-group">
                    <label>Program Image</label>
                    <label className="program-image-upload">
                      {imagePreview ? <img src={imagePreview} alt="Program preview" /> : <ImagePlus size={26} />}
                      <span><Upload size={14} /> {selectedImage ? 'Choose a different image' : 'Upload image'}</span>
                      <small>PNG, JPG, WEBP or GIF up to 5 MB</small>
                      <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleImageChange} />
                    </label>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Display Order</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                      min={1}
                    />
                  </div>     
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                  <input 
                    type="checkbox" 
                    id="programActive"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <label htmlFor="programActive" style={{ margin: 0, cursor: 'pointer' }}>
                    Show immediately on public NGO websitee (Active)
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : editingProgram ? 'Save Changes' : 'Create Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
