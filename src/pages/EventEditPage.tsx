import React, { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeft, Calendar, ImagePlus, Save, Upload } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminApi } from '../services/adminApi';

interface EventFormData {
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  imageUrl: string;
  category: string;
  registrationUrl: string;
  published: boolean;
}

const CATEGORIES = [
  'Healthcare', 'Education', 'Environment', 'Food Support',
  'Women & Children', 'Community', 'Fundraiser', 'Awareness',
];

const emptyEvent: EventFormData = {
  title: '',
  description: '',
  eventDate: new Date().toISOString().split('T')[0],
  eventTime: '10:00 AM - 01:00 PM',
  location: '',
  imageUrl: '',
  category: 'Community',
  registrationUrl: '',
  published: true,
};

export const EventEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const [formData, setFormData] = useState<EventFormData>(emptyEvent);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!id) return;

    const loadEvent = async () => {
      try {
        const events = await AdminApi.getEvents();
        const event = events.find((item: EventFormData & { id: number }) => item.id === Number(id));
        if (!event) {
          setErrorMsg('Event not found.');
          return;
        }
        setFormData({
          title: event.title,
          description: event.description,
          eventDate: event.eventDate,
          eventTime: event.eventTime || '',
          location: event.location,
          imageUrl: event.imageUrl || '',
          category: event.category || 'Community',
          registrationUrl: event.registrationUrl || '',
          published: event.published,
        });
        setImagePreview(event.imageUrl || '');
      } catch (err: any) {
        setErrorMsg(err.response?.data?.message || 'Failed to load event.');
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  const updateField = <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setErrorMsg('');

    try {
      let eventData = formData;
      if (selectedImage) {
        const uploadResponse = await AdminApi.uploadEventImage(selectedImage);
        eventData = { ...formData, imageUrl: uploadResponse.imageUrl };
      }
      if (id) {
        await AdminApi.updateEvent(Number(id), eventData);
      } else {
        await AdminApi.createEvent(eventData);
      }
      navigate('/events');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to save event. Please check inputs.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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

  return (
    <div className="event-edit-page">
      <div className="event-edit-header">
        <div>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => navigate('/events')}>
            <ArrowLeft size={15} /> Back to Events
          </button>
          <h2>{isEditing ? 'Edit Event' : 'Create New Event'}</h2>
          <p>Update the details shown on the public NGO website.</p>
        </div>
        <Calendar size={34} color="var(--color-primary)" />
      </div>

      <div className="event-edit-card">
        {loading ? (
          <div className="loading-indicator"><div className="spinner"></div><span>Loading event...</span></div>
        ) : (
          <form onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="event-form-error"><AlertCircle size={16} />{errorMsg}</div>
            )}

            <div className="form-group">
              <label>Event Title *</label>
              <input type="text" className="form-control" required value={formData.title} onChange={(e) => updateField('title', e.target.value)} />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea className="form-control" rows={5} required value={formData.description} onChange={(e) => updateField('description', e.target.value)} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Event Date *</label>
                <input type="date" className="form-control" required value={formData.eventDate} onChange={(e) => updateField('eventDate', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Time Schedule</label>
                <input type="text" className="form-control" value={formData.eventTime} onChange={(e) => updateField('eventTime', e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select className="form-control" required value={formData.category} onChange={(e) => updateField('category', e.target.value)}>
                  {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Location / Venue *</label>
                <input type="text" className="form-control" required value={formData.location} onChange={(e) => updateField('location', e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Event Image</label>
                <label className="program-image-upload">
                  <span className="program-image-preview">
                    {imagePreview ? <img src={imagePreview} alt="Event preview" /> : <ImagePlus size={22} />}
                  </span>
                  <span className="program-image-upload-content">
                    <span className="program-image-upload-button"><Upload size={14} /> Upload Image</span>
                    <small>PNG, JPG, WEBP or GIF up to 5 MB</small>
                  </span>
                  <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleImageChange} />
                </label>
              </div>
              <div className="form-group">
                <label>Join / Registration Link</label>
                <input type="url" className="form-control" value={formData.registrationUrl} onChange={(e) => updateField('registrationUrl', e.target.value)} />
              </div>
            </div>

            <label className="event-publish-option">
              <input type="checkbox" checked={formData.published} onChange={(e) => updateField('published', e.target.checked)} />
              Publish event to public NGO website immediately
            </label>

            <div className="event-edit-actions">
              <button type="button" className="btn btn-outline" onClick={() => navigate('/events')} disabled={saving}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Save size={16} /> {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Event'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};