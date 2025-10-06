const API_BASE_URL = 'http://localhost:8001';

class DocumentService {
  async getDocuments(category = null) {
    try {
      const url = category 
        ? `${API_BASE_URL}/documents/?category=${category}`
        : `${API_BASE_URL}/documents/`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const documents = await response.json();
      
      // Transform the API response to match the expected format
      return documents.map(doc => ({
        id: doc.id.toString(),
        title: doc.title,
        description: doc.description,
        type: doc.file_type,
        url: `${API_BASE_URL}/documents/${doc.id}/view`, // Use view endpoint for iframe
        downloadUrl: `${API_BASE_URL}/documents/${doc.id}/download`, // Separate download URL
        filename: doc.filename,
        category: doc.category,
        fileSize: doc.file_size,
        downloadCount: doc.download_count,
        createdAt: doc.created_at,
        updatedAt: doc.updated_at
      }));
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  }

  async getDocumentById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const doc = await response.json();
      
      return {
        id: doc.id.toString(),
        title: doc.title,
        description: doc.description,
        type: doc.file_type,
        url: `${API_BASE_URL}/documents/${doc.id}/view`, // Use view endpoint for iframe
        downloadUrl: `${API_BASE_URL}/documents/${doc.id}/download`, // Separate download URL
        filename: doc.filename,
        category: doc.category,
        fileSize: doc.file_size,
        downloadCount: doc.download_count,
        createdAt: doc.created_at,
        updatedAt: doc.updated_at
      };
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error;
    }
  }

  async downloadDocument(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${id}/download`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'document.pdf';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return true;
    } catch (error) {
      console.error('Error downloading document:', error);
      throw error;
    }
  }

  async uploadDocument(file, title, description = '', category = 'others') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);

      const response = await fetch(`${API_BASE_URL}/documents/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const doc = await response.json();
      
      return {
        id: doc.id.toString(),
        title: doc.title,
        description: doc.description,
        type: doc.file_type,
        url: `${API_BASE_URL}/documents/${doc.id}/view`, // Use view endpoint for iframe
        downloadUrl: `${API_BASE_URL}/documents/${doc.id}/download`, // Separate download URL
        filename: doc.filename,
        category: doc.category,
        fileSize: doc.file_size,
        downloadCount: doc.download_count,
        createdAt: doc.created_at,
        updatedAt: doc.updated_at
      };
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  async updateDocument(id, updates) {
    try {
      const formData = new FormData();
      
      if (updates.title !== undefined) formData.append('title', updates.title);
      if (updates.description !== undefined) formData.append('description', updates.description);
      if (updates.category !== undefined) formData.append('category', updates.category);
      if (updates.is_public !== undefined) formData.append('is_public', updates.is_public);

      const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const doc = await response.json();
      
      return {
        id: doc.id.toString(),
        title: doc.title,
        description: doc.description,
        type: doc.file_type,
        url: `${API_BASE_URL}/documents/${doc.id}/view`, // Use view endpoint for iframe
        downloadUrl: `${API_BASE_URL}/documents/${doc.id}/download`, // Separate download URL
        filename: doc.filename,
        category: doc.category,
        fileSize: doc.file_size,
        downloadCount: doc.download_count,
        createdAt: doc.created_at,
        updatedAt: doc.updated_at
      };
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  async deleteDocument(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
}

export default new DocumentService();
