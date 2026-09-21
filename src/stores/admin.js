import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useApplicantStore } from './applicant';

const STORAGE_KEY = 'bth_admin_data_real_v2';

const defaultApplicants = [];

export const useAdminStore = defineStore('admin', () => {
  const applicantStore = useApplicantStore();

  const loadInitialData = () => {
    try {
      localStorage.removeItem('bth_admin_data_v1');
      localStorage.removeItem('bth_admin_applicants_v2');
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse admin data from storage:', e);
    }
    return [];
  };

  const applicants = ref(loadInitialData());

  watch(
    applicants,
    (newVal) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal));
      } catch (e) {
        console.warn('Failed to persist admin data:', e);
      }
    },
    { deep: true }
  );

  // Helper: Cek apakah ID pendaftar adalah kandidat aktif yang sedang login
  const isCurrentApplicant = (applicantId) => {
    const activeReg = applicantStore.state.candidate?.registrationNumber;
    return applicantId === activeReg || applicantId === 'current-user';
  };

  // Sinkronisasi dinamis pendaftar aktif ke meja kerja admin
  const syncCurrentApplicant = () => {
    const candidate = applicantStore.state.candidate;
    if (!candidate || !candidate.registrationNumber || !candidate.fullName || !candidate.email) return;

    const existingIndex = applicants.value.findIndex(
      (a) => a.id === candidate.registrationNumber || (candidate.email && a.email === candidate.email)
    );

    const verifiedDocs = applicantStore.state.documents.filter((d) => d.status === 'verified').length;
    const pendingDocs = applicantStore.state.documents.filter((d) => d.status !== 'verified').length;

    const hasPendingDoc = applicantStore.state.documents.some((d) => d.status === 'pending');
    const hasRevisionDoc = applicantStore.state.documents.some((d) => d.status === 'revision');
    const currentDocStatus = hasRevisionDoc ? 'revision' : hasPendingDoc ? 'pending' : verifiedDocs >= 3 ? 'verified' : 'pending';
    const existingSelection = existingIndex >= 0 ? applicants.value[existingIndex]?.selection : null;

    const activeApplicantData = {
      id: candidate.registrationNumber,
      nik: candidate.nik || '-',
      nisn: candidate.nisn || '-',
      fullName: candidate.fullName || 'Calon Mahasiswa Baru',
      gender: candidate.gender || 'Perempuan',
      email: candidate.email || 'pendaftar@bth.ac.id',
      phone: candidate.phone || '-',
      schoolName: candidate.schoolName || 'Asal Sekolah Belum Diisi',
      averageScore: candidate.averageScore || '85.00',
      track: applicantStore.state.admission.track || 'Jalur Reguler Gelombang 1',
      faculty: applicantStore.state.admission.prodi1Faculty || 'Fakultas Farmasi',
      prodi1: applicantStore.state.admission.prodi1 || 'Belum Ditentukan',
      prodi2: applicantStore.state.admission.prodi2 || 'Belum Ditentukan',
      registrationDate: 'Hari ini',
      documentStatus: currentDocStatus,
      pendingDocsCount: pendingDocs,
      verifiedDocsCount: verifiedDocs,
      documents: applicantStore.state.documents.map((d) => ({
        id: d.id,
        title: d.title,
        filename: d.filename || 'Belum diunggah',
        filesize: d.filesize || '',
        fileBlobUrl: d.fileBlobUrl || null,
        fileType: d.fileType || '',
        status: d.status === 'unuploaded' ? 'pending' : d.status,
        notes: d.notes || '',
      })),
      payments: {
        registrationFee: {
          id: applicantStore.state.payments.registrationFee.id,
          amount: applicantStore.state.payments.registrationFee.amount,
          status: applicantStore.state.payments.registrationFee.status,
          paidAt: applicantStore.state.payments.registrationFee.paidAt,
          method: applicantStore.state.payments.registrationFee.paymentMethod,
        },
        uktFee: {
          id: applicantStore.state.payments.uktFee.id,
          amount: applicantStore.state.payments.uktFee.amount,
          status: applicantStore.state.payments.uktFee.status,
          paidAt: applicantStore.state.payments.uktFee.paidAt,
          dueDate: applicantStore.state.payments.uktFee.dueDate,
          method: 'Virtual Account BSI / Mandiri',
        },
      },
      selection: {
        cbtScore: applicantStore.state.exam.score || 0,
        interviewScore: existingSelection?.interviewScore ?? (applicantStore.state.result.isPassed ? 88 : null),
        interviewer: existingSelection?.interviewer ?? (applicantStore.state.result.isPassed ? 'Dosen Penguji PMB BTH' : null),
        interviewNotes: existingSelection?.interviewNotes ?? (applicantStore.state.result.isPassed ? 'Pendaftar akun aktif terintegrasi sistem.' : 'Menunggu pelaksanaan tes wawancara peminatan.'),
        passedStatus: applicantStore.state.result.isPassed ? 'passed' : applicantStore.state.exam.status === 'completed' ? 'evaluating' : 'evaluating',
        decisionLetterNo: applicantStore.state.result.decisionLetterNo || null,
      },
      onboarding: {
        isEnrolled: applicantStore.isUktPaid,
        nim: applicantStore.state.onboarding.nim || null,
        pkkmbGroup: applicantStore.state.onboarding.pkkmbGroup || null,
      },
    };

    if (existingIndex >= 0) {
      applicants.value[existingIndex] = { ...applicants.value[existingIndex], ...activeApplicantData };
    } else {
      applicants.value.unshift(activeApplicantData);
    }
  };

  // Reaktif terhadap perubahan data pendaftar aktif
  watch(
    () => applicantStore.state,
    () => {
      syncCurrentApplicant();
    },
    { deep: true, immediate: true }
  );

  // Computed Key Metrics Murni Dinamis
  const totalApplicants = computed(() => applicants.value.length);
  const pendingVerificationCount = computed(() => {
    return applicants.value.filter((a) => a.documentStatus === 'pending' || a.documentStatus === 'revision').length;
  });
  const totalPaidRevenue = computed(() => {
    let sum = 0;
    applicants.value.forEach((a) => {
      if (a.payments?.registrationFee?.status === 'paid') sum += (a.payments.registrationFee.amount || 0);
      if (a.payments?.uktFee?.status === 'paid') sum += (a.payments.uktFee.amount || 0);
    });
    return sum;
  });
  const passedStudentsCount = computed(() => {
    return applicants.value.filter((a) => a.selection.passedStatus === 'passed').length;
  });

  // Action: Verify specific document
  const verifyDocument = (applicantId, docId, status, notes) => {
    const applicant = applicants.value.find((a) => a.id === applicantId);
    if (!applicant) return;

    const doc = applicant.documents.find((d) => d.id === docId);
    if (doc) {
      doc.status = status;
      doc.notes = notes;
    }

    // Recompute applicant document status
    const hasPending = applicant.documents.some((d) => d.status === 'pending');
    const hasRevision = applicant.documents.some((d) => d.status === 'revision');
    applicant.verifiedDocsCount = applicant.documents.filter((d) => d.status === 'verified').length;
    applicant.pendingDocsCount = applicant.documents.filter((d) => d.status === 'pending' || d.status === 'revision').length;

    if (hasRevision) {
      applicant.documentStatus = 'revision';
    } else if (hasPending) {
      applicant.documentStatus = 'pending';
    } else {
      applicant.documentStatus = 'verified';
    }

    // Sinkronisasi dua arah ke applicantStore jika merupakan user aktif
    if (isCurrentApplicant(applicantId)) {
      const targetInApplicant = applicantStore.state.documents.find((d) => d.id === docId);
      if (targetInApplicant) {
        targetInApplicant.status = status;
        targetInApplicant.statusLabel = status === 'verified' ? 'Terverifikasi' : status === 'revision' ? 'Perlu Perbaikan' : 'Sedang Ditinjau';
        targetInApplicant.notes = notes;
      }
    }
  };

  // Action: Confirm UKT or Registration Fee
  const confirmPayment = (applicantId, paymentType) => {
    const applicant = applicants.value.find((a) => a.id === applicantId);
    if (!applicant) return;

    if (paymentType === 'uktFee') {
      applicant.payments.uktFee.status = 'paid';
      applicant.payments.uktFee.paidAt = new Date().toLocaleString('id-ID');
      if (isCurrentApplicant(applicantId)) {
        applicantStore.payUktFee();
      }
    } else if (paymentType === 'registrationFee') {
      applicant.payments.registrationFee.status = 'paid';
      applicant.payments.registrationFee.paidAt = new Date().toLocaleString('id-ID');
      if (isCurrentApplicant(applicantId)) {
        applicantStore.payRegFee();
      }
    }
  };

  // Action: Update Interview Score & Academic Decision
  const updateInterview = (applicantId, score, notes, interviewer) => {
    const applicant = applicants.value.find((a) => a.id === applicantId);
    if (!applicant) return;

    applicant.selection.interviewScore = Number(score);
    applicant.selection.interviewNotes = notes;
    if (interviewer) applicant.selection.interviewer = interviewer;

    const avg = (applicant.selection.cbtScore + Number(score)) / 2;
    if (avg >= 70) {
      applicant.selection.passedStatus = 'passed';
      if (!applicant.selection.decisionLetterNo) {
        applicant.selection.decisionLetterNo = `08${Math.floor(Math.random() * 90 + 10)}/SK-PMB/UBTH/X/2026`;
      }
    } else {
      applicant.selection.passedStatus = 'failed';
    }

    if (isCurrentApplicant(applicantId)) {
      applicantStore.state.result.isPassed = applicant.selection.passedStatus === 'passed';
      if (applicant.selection.decisionLetterNo) {
        applicantStore.state.result.decisionLetterNo = applicant.selection.decisionLetterNo;
      }
    }
  };

  // Action: Generate Official NIM & Plot Gugus
  const generateNim = (applicantId, customNim, group) => {
    const applicant = applicants.value.find((a) => a.id === applicantId);
    if (!applicant) return;

    applicant.onboarding.isEnrolled = true;
    applicant.onboarding.nim = customNim || `2601${Math.floor(Math.random() * 9000 + 1000)}`;
    applicant.onboarding.pkkmbGroup = group || 'Gugus 01 - Hygeia Farmasi';

    if (isCurrentApplicant(applicantId)) {
      applicantStore.state.onboarding.nim = applicant.onboarding.nim;
      applicantStore.state.onboarding.pkkmbGroup = applicant.onboarding.pkkmbGroup;
    }
  };

  // Action: Reset admin data
  const resetAdminData = () => {
    applicants.value = [];
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('bth_admin_data_v1');
    localStorage.removeItem('bth_admin_applicants_v2');
    syncCurrentApplicant();
  };

  return {
    applicants,
    totalApplicants,
    pendingVerificationCount,
    totalPaidRevenue,
    passedStudentsCount,
    verifyDocument,
    confirmPayment,
    updateInterview,
    generateNim,
    syncCurrentApplicant,
    resetAdminData,
  };
});
