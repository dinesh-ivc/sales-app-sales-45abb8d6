'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Save, ArrowLeft } from 'lucide-react';
import axios from 'axios';

export default function EditStoreVisitForm() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [formData, setFormData] = useState({
    customerName: '',
    storeLocation: '',
    visitDate: '',
    purchaseAmount: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    const fetchStoreVisit = async () => {
      try {
        const response = await axios.get(`/api/store-visits/${id}`);
        const visit = response.data;
        setFormData({
          customerName: visit.customerName || '',
          storeLocation: visit.storeLocation || '',
          visitDate: visit.visitDate ? new Date(visit.visitDate).toISOString().split('T')[0] : '',
          purchaseAmount: visit.purchaseAmount || '',
          notes: visit.notes || ''
        });
      } catch (error) {
        setAlert({
          show: true,
          type: 'error',
          message: 'Failed to load store visit data'
        });
      }
    };

    if (id) {
      fetchStoreVisit();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!formData.storeLocation.trim()) {
      newErrors.storeLocation = 'Store location is required';
    }

    if (!formData.visitDate) {
      newErrors.visitDate = 'Visit date is required';
    }

    if (formData.purchaseAmount && isNaN(parseFloat(formData.purchaseAmount))) {
      newErrors.purchaseAmount = 'Purchase amount must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setAlert({ ...alert, show: false });

    try {
      await axios.put(`/api/store-visits/${id}`, {
        customerName: formData.customerName.trim(),
        storeLocation: formData.storeLocation.trim(),
        visitDate: new Date(formData.visitDate),
        purchaseAmount: formData.purchaseAmount ? parseFloat(formData.purchaseAmount) : undefined,
        notes: formData.notes.trim()
      });

      setAlert({
        show: true,
        type: 'success',
        message: 'Store visit updated successfully'
      });

      setTimeout(() => {
        router.push('/store-visits');
      }, 1500);
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: error.response?.data?.error || 'Failed to update store visit'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Edit Store Visit</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push('/store-visits')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to List
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {alert.show && (
              <Alert 
                variant={alert.type === 'error' ? 'destructive' : 'default'} 
                className="mb-6"
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {alert.message}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Enter customer name"
                    className={errors.customerName ? 'border-red-500' : ''}
                  />
                  {errors.customerName && (
                    <p className="text-sm text-red-500">{errors.customerName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeLocation">Store Location *</Label>
                  <Input
                    id="storeLocation"
                    name="storeLocation"
                    value={formData.storeLocation}
                    onChange={handleChange}
                    placeholder="Enter store location"
                    className={errors.storeLocation ? 'border-red-500' : ''}
                  />
                  {errors.storeLocation && (
                    <p className="text-sm text-red-500">{errors.storeLocation}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visitDate">Visit Date *</Label>
                  <Input
                    id="visitDate"
                    name="visitDate"
                    type="date"
                    value={formData.visitDate}
                    onChange={handleChange}
                    className={errors.visitDate ? 'border-red-500' : ''}
                  />
                  {errors.visitDate && (
                    <p className="text-sm text-red-500">{errors.visitDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchaseAmount">Purchase Amount</Label>
                  <Input
                    id="purchaseAmount"
                    name="purchaseAmount"
                    type="number"
                    step="0.01"
                    value={formData.purchaseAmount}
                    onChange={handleChange}
                    placeholder="0.00"
                    className={errors.purchaseAmount ? 'border-red-500' : ''}
                  />
                  {errors.purchaseAmount && (
                    <p className="text-sm text-red-500">{errors.purchaseAmount}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Additional notes about the visit"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}