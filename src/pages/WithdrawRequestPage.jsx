import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { enrollmentApi } from "../api/enrollmentApi";
import { adminApi } from "../api/adminApi";
import { calendarApi } from "../api/calendarApi";
import toast from "react-hot-toast";
import { Card, Button, Input, Modal } from "../components/common";
import { useTranslation } from "react-i18next";
import { formatDateTime } from "../utils/formatters";

const WithdrawRequestPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [enrollments, setEnrollments] = useState([]);
  const [withdrawStartDate, setWithdrawStartDate] = useState("");
  const [withdrawEndDate, setWithdrawEndDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    enrollmentApi
      .getMyEnrollments()
      .then((res) => {
        const data = res?.data;
        setEnrollments(Array.isArray(data) ? data : []);
      })
      .catch(() => setEnrollments([]));
    calendarApi.getTimeline().then((data) => {
      setWithdrawStartDate(data?.withdrawStartDate || "");
      setWithdrawEndDate(data?.withdrawEndDate || "");
    }).catch(() => {
      adminApi.getRegistrationEndDate().then((res) => {
        setWithdrawStartDate(res.data?.withdrawStartDate || "");
        setWithdrawEndDate(res.data?.withdrawEndDate || "");
      });
    });
  }, []);

  const now = new Date();
  const canWithdraw = withdrawStartDate && withdrawEndDate && now >= new Date(withdrawStartDate) && now <= new Date(withdrawEndDate);

  const withdrawStartText = withdrawStartDate
    ? formatDateTime(withdrawStartDate, { year: 'numeric', month: 'short', day: 'numeric' })
    : '—';
  const withdrawEndText = withdrawEndDate
    ? formatDateTime(withdrawEndDate, { year: 'numeric', month: 'short', day: 'numeric' })
    : '—';

  const handleOpenModal = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error(t('withdrawRequests.errors.reasonRequired'));
      return;
    }
    setIsSubmitting(true);
    try {
      await adminApi.submitMyWithdrawRequest(selectedEnrollment.enrollmentId, reason);
      toast.success(t('withdrawRequests.toasts.submitted'));
      setShowModal(false);
      setReason("");
    } catch (error) {
      toast.error(error?.message || t('withdrawRequests.errors.submitFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card title={t('nav.withdrawRequests')}>
        <p>{t('withdrawRequests.period', { start: withdrawStartText, end: withdrawEndText })}</p>
        {canWithdraw ? (
          <ul className="space-y-4">
            {enrollments.filter(e => e.status === "Enrolled").map(enrollment => (
              <li key={enrollment.enrollmentId} className="flex justify-between items-center">
                <span>{enrollment.courseName || enrollment.sectionName}</span>
                <Button onClick={() => handleOpenModal(enrollment)}>
                  {t('withdrawRequests.requestWithdraw')}
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-red-500">{t('withdrawRequests.periodInactive')}</p>
        )}
      </Card>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={t('nav.withdrawRequest')}>
        <div className="space-y-4">
          <label className="block font-medium">{t('withdrawRequests.reasonLabel')}</label>
          <Input
            type="text"
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder={t('withdrawRequests.reasonPlaceholder')}
          />
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? t('common.submitting') : t('withdrawRequests.submitRequest')}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default WithdrawRequestPage;
