import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import academicPlanApi from "../api/academicPlanApi";
import { useAuth } from "../contexts/AuthContext";

import Card from "../components/common/Card";
import Table from "../components/common/Table";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import Input from "../components/common/Input";
import Select from "../components/common/Select";

const defaultPlanForm = {
  academicPlanId: "",
  majorName: "",
  totalCreditsRequired: "",
  expectedYearsToComplete: "",
  description: "",
};

const AcademicPlanPage = () => {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();

  // Shared
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Student progress
  const [progress, setProgress] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(false);

  // Admin plans
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);

  // Admin courses preview
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  // Admin plan modal
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [planForm, setPlanForm] = useState(defaultPlanForm);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [loadingPlanForm, setLoadingPlanForm] = useState(false);

  // Admin assign modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignForm, setAssignForm] = useState({ studentId: "", academicPlanId: "" });

  const loadStudentProgress = async () => {
    setLoadingProgress(true);
    try {
      const res = await academicPlanApi.getMyProgress();
      setProgress(res.data);
    } catch {
      toast.error(t("academicPlan.errors.progressFetchFailed"));
    } finally {
      setLoadingProgress(false);
    }
  };

  const loadPlans = async () => {
    setLoadingPlans(true);
    try {
      const res = await academicPlanApi.getAll();
      setPlans(res.data);
    } catch {
      toast.error(t("academicPlan.errors.fetchFailed"));
    } finally {
      setLoadingPlans(false);
    }
  };

  const loadCourses = async (planId) => {
    setLoadingCourses(true);
    try {
      const res = await academicPlanApi.getCourses(planId);
      setCourses(res.data);
    } catch {
      toast.error(t("academicPlan.errors.coursesFetchFailed"));
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    if (isAdmin()) loadPlans();
    else loadStudentProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreatePlan = () => {
    setEditingPlanId(null);
    setPlanForm(defaultPlanForm);
    setPlanModalOpen(true);
  };

  const openEditPlan = async (plan) => {
    const planId = plan.academicPlanId || plan.id;
    setEditingPlanId(planId);
    setPlanModalOpen(true);
    setLoadingPlanForm(true);
    try {
      const full = await academicPlanApi.getById(planId);
      setPlanForm({
        academicPlanId: full.data.academicPlanId ?? planId,
        majorName: full.data.majorName ?? "",
        totalCreditsRequired: String(full.data.totalCreditsRequired ?? ""),
        expectedYearsToComplete: String(full.data.expectedYearsToComplete ?? ""),
        description: full.data.description ?? "",
      });
    } catch {
      toast.error(t("academicPlan.errors.fetchFailed"));
    } finally {
      setLoadingPlanForm(false);
    }
  };

  const closePlanModal = () => {
    setPlanModalOpen(false);
    setEditingPlanId(null);
    setPlanForm(defaultPlanForm);
  };

  const submitPlan = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        academicPlanId: editingPlanId ? editingPlanId : planForm.academicPlanId,
        majorName: planForm.majorName,
        totalCreditsRequired: Number(planForm.totalCreditsRequired),
        expectedYearsToComplete: Number(planForm.expectedYearsToComplete),
        description: planForm.description,
      };

      if (editingPlanId) {
        await academicPlanApi.update(payload);
        toast.success(t("academicPlan.toasts.updated"));
      } else {
        await academicPlanApi.create(payload);
        toast.success(t("academicPlan.toasts.created"));
      }
      closePlanModal();
      await loadPlans();
    } catch {
      toast.error(t("academicPlan.errors.saveFailed"));
    }
  };

  const deletePlan = async (planId) => {
    if (!window.confirm(t("academicPlan.confirmDelete"))) return;
    try {
      await academicPlanApi.delete(planId);
      toast.success(t("academicPlan.toasts.deleted"));
      await loadPlans();
      if (selectedPlan?.academicPlanId === planId) {
        setSelectedPlan(null);
        setCourses([]);
      }
    } catch {
      toast.error(t("academicPlan.errors.deleteFailed"));
    }
  };

  const openAssign = (plan) => {
    const planId = plan.academicPlanId || plan.id;
    setSelectedPlan(plan);
    setAssignForm({ studentId: "", academicPlanId: planId });
    setAssignModalOpen(true);
  };

  const submitAssign = async (e) => {
    e.preventDefault();
    try {
      await academicPlanApi.assignStudent({
        studentId: Number(assignForm.studentId),
        academicPlanId: assignForm.academicPlanId,
      });
      toast.success(t("academicPlan.toasts.assigned"));
      setAssignModalOpen(false);
    } catch {
      toast.error(t("academicPlan.errors.assignFailed"));
    }
  };

  const viewCourses = async (plan) => {
    const planId = plan.academicPlanId || plan.id;
    setSelectedPlan(plan);
    await loadCourses(planId);
  };

  const planColumns = useMemo(() => {
    const cols = [
      { key: "academicPlanId", header: t("academicPlan.fields.academicPlanId") },
      { key: "majorName", header: t("academicPlan.fields.majorName") },
      { key: "totalCreditsRequired", header: t("academicPlan.fields.totalCreditsRequired") },
      { key: "expectedYearsToComplete", header: t("academicPlan.fields.expectedYearsToComplete") },
    ];

    cols.push({
      key: "actions",
      header: t("common.actions"),
      render: (_v, row) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => openEditPlan(row)}>
            {t("common.edit")}
          </Button>
          <Button size="sm" variant="danger" onClick={() => deletePlan(row.academicPlanId || row.id)}>
            {t("common.delete")}
          </Button>
          <Button size="sm" variant="secondary" onClick={() => openAssign(row)}>
            {t("academicPlan.actions.assign")}
          </Button>
          <Button size="sm" variant="outline" onClick={() => viewCourses(row)}>
            {t("academicPlan.actions.courses")}
          </Button>
        </div>
      ),
    });

    return cols;
  }, [t]);

  const studentCourseColumns = useMemo(
    () => [
      { key: "courseCode", header: t("academicPlan.courseTable.courseCode") },
      { key: "courseName", header: t("academicPlan.courseTable.title") },
      { key: "creditHours", header: t("academicPlan.courseTable.credits") },
      {
        key: "status",
        header: t("academicPlan.courseTable.status"),
        render: (value, row) => {
          if (value === "COMPLETED") {
            if (row?.isPassed === false) return t("academicPlan.status.completedNotPassed");
            return t("academicPlan.status.completed");
          }
          if (value === "IN_PROGRESS") return t("academicPlan.status.inProgress");
          if (value === "PLANNED") return t("academicPlan.status.planned");
          return value;
        },
      },
      { key: "grade", header: t("academicPlan.courseTable.grade"), render: (v) => v || "—" },
    ],
    [t]
  );

  if (!isAdmin()) {
    return (
      <Card title={t("academicPlan.student.title")} subtitle={t("academicPlan.student.subtitle")}>
        {loadingProgress && !progress ? (
          <div className="text-sm text-gray-600 dark:text-gray-400">{t("common.loading")}</div>
        ) : progress ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <strong>{t("academicPlan.student.major")}:</strong> {progress.majorName || t("common.notAssigned")}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <strong>{t("academicPlan.student.expectedGraduationYear")}:</strong> {progress.expectedGraduationYear || "—"}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <strong>{t("academicPlan.student.currentGpa")}:</strong>{" "}
                {typeof progress.currentGPA === "number" ? progress.currentGPA.toFixed(2) : "0.00"}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-900 dark:text-white">
                  {t("academicPlan.student.percentComplete", { percent: progress.progressPercentage ?? 0 })}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t("academicPlan.student.creditsOf", {
                    completed: progress.creditsCompleted,
                    total: progress.totalCreditsRequired,
                  })}
                </div>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-3 bg-primary-600 rounded-full"
                  style={{ width: `${Math.min(100, Math.max(0, progress.progressPercentage || 0))}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">{t("academicPlan.student.earnedCredits")}</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {progress.creditsCompleted} / {progress.totalCreditsRequired}
                </div>
              </div>
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">{t("academicPlan.student.requiredCourses")}</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("academicPlan.student.requiredCoursesCompletedOf", {
                    completed: progress.requiredCoursesCompletedCount,
                    total: progress.requiredCoursesCount,
                  })}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="font-semibold text-gray-900 dark:text-white mb-2">
                {t("academicPlan.student.prerequisiteWarnings")}
              </div>
              {Array.isArray(progress.missingPrerequisiteWarnings) && progress.missingPrerequisiteWarnings.length > 0 ? (
                <ul className="list-disc ml-6 text-sm text-yellow-800 dark:text-yellow-300">
                  {progress.missingPrerequisiteWarnings.map((w) => (
                    <li key={w.courseId}>
                      <strong>{w.courseCode}</strong>: {t("academicPlan.student.missing")} {Array.isArray(w.missingCourseCodes) ? w.missingCourseCodes.join(", ") : ""}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-gray-600 dark:text-gray-400">{t("academicPlan.student.noPrereqWarnings")}</div>
              )}
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{t("academicPlan.student.warningsNote")}</div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="font-semibold text-gray-900 dark:text-white mb-2">{t("academicPlan.student.completedCourses")}</div>
                <Table
                  columns={studentCourseColumns}
                  data={Array.isArray(progress.completedCourses) ? progress.completedCourses : []}
                  isLoading={loadingProgress}
                  emptyMessage={t("academicPlan.student.empty.completed")}
                />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white mb-2">{t("academicPlan.student.inProgressCourses")}</div>
                <Table
                  columns={studentCourseColumns}
                  data={Array.isArray(progress.inProgressCourses) ? progress.inProgressCourses : []}
                  isLoading={loadingProgress}
                  emptyMessage={t("academicPlan.student.empty.inProgress")}
                />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white mb-2">{t("academicPlan.student.plannedCourses")}</div>
                <Table
                  columns={studentCourseColumns}
                  data={Array.isArray(progress.remainingCourses) ? progress.remainingCourses : []}
                  isLoading={loadingProgress}
                  emptyMessage={t("academicPlan.student.empty.planned")}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-600 dark:text-gray-400">{t("common.notAvailable")}</div>
        )}
      </Card>
    );
  }

  return (
    <Card title={t("academicPlan.admin.title")}>
      <div className="mb-4 flex justify-end">
        <Button onClick={openCreatePlan}>{t("academicPlan.actions.addPlan")}</Button>
      </div>

      <Table columns={planColumns} data={plans} isLoading={loadingPlans} emptyMessage={t("table.empty")} />

      <Modal
        isOpen={planModalOpen}
        onClose={closePlanModal}
        title={editingPlanId ? t("academicPlan.admin.editTitle") : t("academicPlan.admin.addTitle")}
      >
        {loadingPlanForm ? (
          <div className="text-sm text-gray-600 dark:text-gray-400">{t("common.loading")}</div>
        ) : (
          <form onSubmit={submitPlan} className="space-y-4">
            {!editingPlanId && (
              <Input
                label={t("academicPlan.fields.academicPlanId")}
                name="academicPlanId"
                value={planForm.academicPlanId}
                onChange={(e) => setPlanForm((p) => ({ ...p, academicPlanId: e.target.value }))}
                required
              />
            )}
            <Input
              label={t("academicPlan.fields.majorName")}
              name="majorName"
              value={planForm.majorName}
              onChange={(e) => setPlanForm((p) => ({ ...p, majorName: e.target.value }))}
              required
            />
            <Input
              label={t("academicPlan.fields.totalCreditsRequired")}
              name="totalCreditsRequired"
              value={planForm.totalCreditsRequired}
              onChange={(e) => setPlanForm((p) => ({ ...p, totalCreditsRequired: e.target.value }))}
              required
            />
            <Input
              label={t("academicPlan.fields.expectedYearsToComplete")}
              name="expectedYearsToComplete"
              value={planForm.expectedYearsToComplete}
              onChange={(e) => setPlanForm((p) => ({ ...p, expectedYearsToComplete: e.target.value }))}
              required
            />
            <Input
              label={t("academicPlan.fields.description")}
              name="description"
              value={planForm.description}
              onChange={(e) => setPlanForm((p) => ({ ...p, description: e.target.value }))}
              required
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={closePlanModal}>
                {t("common.cancel")}
              </Button>
              <Button type="submit">{editingPlanId ? t("common.update") : t("common.create")}</Button>
            </div>
          </form>
        )}
      </Modal>

      <Modal isOpen={assignModalOpen} onClose={() => setAssignModalOpen(false)} title={t("academicPlan.admin.assignTitle")}>
        <form onSubmit={submitAssign} className="space-y-4">
          <Input
            label={t("academicPlan.fields.studentId")}
            name="studentId"
            value={assignForm.studentId}
            onChange={(e) => setAssignForm((p) => ({ ...p, studentId: e.target.value }))}
            required
          />
          <Select
            label={t("academicPlan.fields.academicPlanId")}
            value={assignForm.academicPlanId}
            onChange={(e) => setAssignForm((p) => ({ ...p, academicPlanId: e.target.value }))}
            options={(Array.isArray(plans) ? plans : []).map((p) => ({
              value: p.academicPlanId,
              label: `${p.academicPlanId} - ${p.majorName}`,
            }))}
            required
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setAssignModalOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit">{t("common.save")}</Button>
          </div>
        </form>
      </Modal>

      {selectedPlan && (
        <div className="mt-6 space-y-2">
          <div className="font-semibold text-gray-900 dark:text-white">
            {t("academicPlan.admin.coursesFor", { id: selectedPlan.academicPlanId || selectedPlan.id })}
          </div>
          <Table
            columns={[
              { key: "courseCode", header: t("academicPlan.courseTable.courseCode") },
              { key: "courseName", header: t("academicPlan.courseTable.title") },
              { key: "creditHours", header: t("academicPlan.courseTable.credits") },
              { key: "courseType", header: t("academicPlan.courseTable.type") },
              { key: "recommendedYear", header: t("academicPlan.courseTable.recommendedYear") },
              { key: "recommendedSemester", header: t("academicPlan.courseTable.recommendedSemester") },
              { key: "isRequired", header: t("academicPlan.courseTable.required"), render: (v) => (v ? t("common.yes") : t("common.no")) },
            ]}
            data={Array.isArray(courses) ? courses : []}
            isLoading={loadingCourses}
            emptyMessage={t("academicPlan.admin.emptyCourses")}
          />
        </div>
      )}
    </Card>
  );
};

export default AcademicPlanPage;
