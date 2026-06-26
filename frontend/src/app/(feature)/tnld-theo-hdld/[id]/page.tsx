'use client'

import { Agreement } from "@/src/api/Agreement";
import { AgreementTable } from "@/src/api/types/agreement";
import InputLegend from "@/src/components/InputLegend";
import SelectLegend from "@/src/components/SelectLegend";
import TopHero from "@/src/components/TopHero";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { SubmitForm } from "../_types/type";
import DetailItem from "../_component/DetailItem";
import { Job } from "@/src/api/Job";
import { JobDto } from "@/src/api/types/job";
import { Accident } from "@/src/api/Accident";
import { AccidentDto } from "@/src/api/types/accident";
import { NotificateContext } from "@/src/contexts/notificate/notificate";
import { TraumaDto } from "@/src/api/types/trauma";
import { Trauma } from "@/src/api/Trauma";
import ViewReport from "../_component/ViewReport";
import { Media } from "@/src/api/Media";
import { ConfirmContext } from "@/src/contexts/confirm/confirm";
import Loading from "@/src/components/Loading";

type OptionReport = "business-info" | "option-1" | "option-2" | "review-report";

const TNLDTheoHDLDIdPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const notificate = useContext(NotificateContext);
    const confirm = useContext(ConfirmContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isPrint, setIsPrint] = useState<boolean>(false);

    if (!id) {
        router.push("/tnld-theo-hdld");
    }

    const [detail, setDetail] = useState<AgreementTable>();
    const fetchDetail = async () => {
        if (!id) return;
        try {
            const cls = new Agreement();
            const result = await cls.GetFeTableById(Array.isArray(id) ? id[0] : id);

            setDetail(result);
        } catch (error) {
            alert(error);
        }
    }

    const [accidents, setAccidents] = useState<AccidentDto[]>([]);
    const [traumas, setTraumas] = useState<TraumaDto[]>([]);
    const [jobs, setJobs] = useState<JobDto[]>([]);
    const fetchOtherData = async () => {
        const accidentCls = new Accident();
        const traumaCls = new Trauma();
        const jobCls = new Job();

        const result = await Promise.all([jobCls.GetAll(), traumaCls.GetAll(), accidentCls.GetAll()]);
        setJobs(result[0]);
        setTraumas(result[1])
        setAccidents(result[2]);
    }

    useEffect(() => {
        if (!id) return;
        fetchDetail();
        fetchOtherData();
    }, [id]);

    const [submitForm, setSubmitForm] = useState<SubmitForm>({
        title: detail?.title || "",
        year: detail?.year! || 0,
        reportTypeId: detail?.reportTypeId || 0,

        totalEmployees: detail?.totalEmployees || 0,
        femaleEmployees: detail?.femaleEmployees || 0,
        totalPayroll: detail?.totalPayroll || 0,

        // Muc 1
        // Muc 1.1
        m1TotalCases: detail?.m1TotalCases || 0,
        m1FatalCases: detail?.m1FatalCases || 0,
        m1MultiVictimCases: detail?.m1MultiVictimCases || 0,

        m1TotalVictims: detail?.m1TotalVictims || 0,
        m1FemaleVictims: detail?.m1FemaleVictims || 0,
        m1FatalVictims: detail?.m1FatalVictims || 0,
        m1SevereInjuries: detail?.m1SevereInjuries || 0,

        m1NonManagedVictims: detail?.m1NonManagedVictims || 0,
        m1NonManagedFemaleVictims: detail?.m1NonManagedFemaleVictims || 0,
        m1NonManagedFatalVictims: detail?.m1NonManagedFatalVictims || 0,
        m1NonManagedSevereInjuries: detail?.m1NonManagedSevereInjuries || 0,

        // Muc 1.2
        m1MedicalCost: detail?.m1MedicalCost || 0,
        m1SalaryCompensation: detail?.m1SalaryCompensation || 0,
        m1PropertyDamage: detail?.m1PropertyDamage || 0,
        m1TotalCost: detail?.m1TotalCost || 0,

        m1TotalLeaveDays: detail?.m1TotalLeaveDays || 0,
        m1TotalDamage: detail?.m1TotalDamage || 0,

        details: detail?.details!.map((d, index) => ({
            idx: index,
            causeId: d.causeId,
            traumaId: d.traumaId,
            jobId: d.jobId,

            totalCases: d.totalCases,
            fatalCases: d.fatalCases,
            multiVictimCases: d.multiVictimCases,

            totalVictims: d.totalVictims,
            femaleVictims: d.femaleVictims,
            fatalVictims: d.fatalVictims,
            severeInjuries: d.severeInjuries,
            nonManagedVictims: d.nonManagedVictims,
            nonManagedFemaleVictims: d.nonManagedFemaleVictims,
            nonManagedFatalVictims: d.nonManagedFatalVictims,
            nonManagedSevereInjuries: d.nonManagedSevereInjuries,
            medicalCost: d.medicalCost,
            salaryCompensation: d.salaryCompensation,
            propertyDamage: d.propertyDamage,
            totalCost: d.totalCost,
            totalLeaveDays: d.totalLeaveDays,
            totalDamage: d.totalDamage,
        })) ?? [],

        // Muc 2
        // Muc 2.1
        m2TotalCases: detail?.m2TotalCases || 0,
        m2FatalCases: detail?.m2FatalCases || 0,
        m2MultiVictimCases: detail?.m2MultiVictimCases || 0,

        m2TotalVictims: detail?.m2TotalVictims || 0,
        m2FemaleVictims: detail?.m2FemaleVictims || 0,
        m2FatalVictims: detail?.m2FatalVictims || 0,
        m2SevereInjuries: detail?.m2SevereInjuries || 0,

        m2NonManagedVictims: detail?.m2NonManagedVictims || 0,
        m2NonManagedFemaleVictims: detail?.m2NonManagedFemaleVictims || 0,
        m2NonManagedFatalVictims: detail?.m2NonManagedFatalVictims || 0,
        m2NonManagedSevereInjuries: detail?.m2NonManagedSevereInjuries || 0,

        // Muc 2.2
        m2MedicalCost: detail?.m2MedicalCost || 0,
        m2SalaryCompensation: detail?.m2SalaryCompensation || 0,
        m2PropertyDamage: detail?.m2PropertyDamage || 0,
        m2TotalCost: detail?.m2TotalCost || 0,

        m2TotalLeaveDays: detail?.m2TotalLeaveDays || 0,
        m2TotalDamage: detail?.m2TotalDamage || 0,

        fileIds: detail?.files!.map(f => f.originalFilename) ?? []
    });

    useEffect(() => {
        if (!detail) return;
        if (!(detail.status === "DRAF")) {
            router.push(`/tnld-theo-hdld/view/${detail.id}`)
        }

        setSubmitForm({
            title: detail.title || "",
            year: Number(detail.year) || 0,
            reportTypeId: Number(detail.reportTypeId) || 0,

            totalEmployees: Number(detail.totalEmployees) || 0,
            femaleEmployees: Number(detail.femaleEmployees) || 0,
            totalPayroll: Number(detail.totalPayroll) || 0,

            m1TotalCases: Number(detail.m1TotalCases) || 0,
            m1FatalCases: Number(detail.m1FatalCases) || 0,
            m1MultiVictimCases: Number(detail.m1MultiVictimCases) || 0,

            m1TotalVictims: Number(detail.m1TotalVictims) || 0,
            m1FemaleVictims: Number(detail.m1FemaleVictims) || 0,
            m1FatalVictims: Number(detail.m1FatalVictims) || 0,
            m1SevereInjuries: Number(detail.m1SevereInjuries) || 0,

            m1NonManagedVictims: Number(detail.m1NonManagedVictims) || 0,
            m1NonManagedFemaleVictims: Number(detail.m1NonManagedFemaleVictims) || 0,
            m1NonManagedFatalVictims: Number(detail.m1NonManagedFatalVictims) || 0,
            m1NonManagedSevereInjuries: Number(detail.m1NonManagedSevereInjuries) || 0,

            m1MedicalCost: Number(detail.m1MedicalCost) || 0,
            m1SalaryCompensation: Number(detail.m1SalaryCompensation) || 0,
            m1PropertyDamage: Number(detail.m1PropertyDamage) || 0,
            m1TotalCost: Number(detail.m1TotalCost) || 0,

            m1TotalLeaveDays: Number(detail.m1TotalLeaveDays) || 0,
            m1TotalDamage: Number(detail.m1TotalDamage) || 0,

            details: detail.details?.map((d, index) => ({
                idx: index,
                causeId: Number(d.causeId) || 0,
                traumaId: Number(d.traumaId) || 0,
                jobId: Number(d.jobId) || 0,

                totalCases: Number(d.totalCases) || 0,
                fatalCases: Number(d.fatalCases) || 0,
                multiVictimCases: Number(d.multiVictimCases) || 0,

                totalVictims: Number(d.totalVictims) || 0,
                femaleVictims: Number(d.femaleVictims) || 0,
                fatalVictims: Number(d.fatalVictims) || 0,
                severeInjuries: Number(d.severeInjuries) || 0,

                nonManagedVictims: Number(d.nonManagedVictims) || 0,
                nonManagedFemaleVictims: Number(d.nonManagedFemaleVictims) || 0,
                nonManagedFatalVictims: Number(d.nonManagedFatalVictims) || 0,
                nonManagedSevereInjuries: Number(d.nonManagedSevereInjuries) || 0,

                medicalCost: Number(d.medicalCost) || 0,
                salaryCompensation: Number(d.salaryCompensation) || 0,
                propertyDamage: Number(d.propertyDamage) || 0,
                totalCost: Number(d.totalCost) || 0,

                totalLeaveDays: Number(d.totalLeaveDays) || 0,
                totalDamage: Number(d.totalDamage) || 0,
            })) ?? [],

            m2TotalCases: Number(detail.m2TotalCases) || 0,
            m2FatalCases: Number(detail.m2FatalCases) || 0,
            m2MultiVictimCases: Number(detail.m2MultiVictimCases) || 0,

            m2TotalVictims: Number(detail.m2TotalVictims) || 0,
            m2FemaleVictims: Number(detail.m2FemaleVictims) || 0,
            m2FatalVictims: Number(detail.m2FatalVictims) || 0,
            m2SevereInjuries: Number(detail.m2SevereInjuries) || 0,

            m2NonManagedVictims: Number(detail.m2NonManagedVictims) || 0,
            m2NonManagedFemaleVictims: Number(detail.m2NonManagedFemaleVictims) || 0,
            m2NonManagedFatalVictims: Number(detail.m2NonManagedFatalVictims) || 0,
            m2NonManagedSevereInjuries: Number(detail.m2NonManagedSevereInjuries) || 0,

            m2MedicalCost: Number(detail.m2MedicalCost) || 0,
            m2SalaryCompensation: Number(detail.m2SalaryCompensation) || 0,
            m2PropertyDamage: Number(detail.m2PropertyDamage) || 0,
            m2TotalCost: Number(detail.m2TotalCost) || 0,

            m2TotalLeaveDays: Number(detail.m2TotalLeaveDays) || 0,
            m2TotalDamage: Number(detail.m2TotalDamage) || 0,

            fileIds: detail.files?.map(f => f.originalFilename) ?? []
        });
    }, [detail]);

    const onChangDetail = (
        idx: number,
        field: string,
        value: string | number
    ) => {
        setSubmitForm(prev => {
            const newDetails = [...prev.details];

            const existingIndex = newDetails.findIndex(d => d.idx === idx);
            console.log(field, value)

            if (existingIndex === -1) return prev;

            newDetails[existingIndex] = {
                ...newDetails[existingIndex],
                [field]: value,
            };

            return {
                ...prev,
                details: newDetails,

                m1TotalCases: newDetails.reduce((s, d) => s + d.totalCases, 0),
                m1FatalCases: newDetails.reduce((s, d) => s + d.fatalCases, 0),
                m1MultiVictimCases: newDetails.reduce((s, d) => s + d.multiVictimCases, 0),
                m1TotalVictims: newDetails.reduce((s, d) => s + d.totalVictims, 0),
                m1FemaleVictims: newDetails.reduce((s, d) => s + d.femaleVictims, 0),
                m1FatalVictims: newDetails.reduce((s, d) => s + d.fatalVictims, 0),
                m1SevereInjuries: newDetails.reduce((s, d) => s + d.severeInjuries, 0),
                m1NonManagedVictims: newDetails.reduce((s, d) => s + d.nonManagedVictims, 0),
                m1NonManagedFemaleVictims: newDetails.reduce((s, d) => s + d.nonManagedFemaleVictims, 0),
                m1NonManagedFatalVictims: newDetails.reduce((s, d) => s + d.nonManagedFatalVictims, 0),
                m1NonManagedSevereInjuries: newDetails.reduce((s, d) => s + d.nonManagedSevereInjuries, 0),
                m1MedicalCost: newDetails.reduce((s, d) => s + d.medicalCost, 0),
                m1SalaryCompensation: newDetails.reduce((s, d) => s + d.salaryCompensation, 0),
                m1PropertyDamage: newDetails.reduce((s, d) => s + d.propertyDamage, 0),
                m1TotalLeaveDays: newDetails.reduce((s, d) => s + d.totalLeaveDays, 0),
                m1TotalDamage: newDetails.reduce((s, d) => s + d.totalDamage, 0),
                m1TotalCost: newDetails.reduce((s, d) => s + d.medicalCost + d.salaryCompensation + d.propertyDamage, 0),
            };
        });
    };

    const handleSyncDetail = () => {
        if (!submitForm.m1TotalCases) {
            notificate?.showNotification({ type: "error", message: "Tổng số vụ phải lớn hơn 0 mới được đồng bộ " });
            return;
        }

        const newDetails = Array.from({ length: submitForm.m1TotalCases }, (_, v) => ({
            idx: v,
            "causeId": 0,
            "traumaId": 0,
            "jobId": 0,

            "totalCases": 1,
            "fatalCases": 0,
            "multiVictimCases": 0,
            "totalVictims": 0,
            "femaleVictims": 0,
            "fatalVictims": 0,
            "severeInjuries": 0,
            "nonManagedVictims": 0,
            "nonManagedFemaleVictims": 0,
            "nonManagedFatalVictims": 0,
            "nonManagedSevereInjuries": 0,
            "medicalCost": 0,
            "salaryCompensation": 0,
            "propertyDamage": 0,
            "totalCost": 0,
            "totalLeaveDays": 0,
            "totalDamage": 0,
        }));

        setSubmitForm(prev => ({ ...prev, details: newDetails }));
    }

    const handleAddDetail = () => {
        setSubmitForm(prev => {
            const nextId =
                prev.details.length === 0
                    ? 0
                    : Math.max(...prev.details.map(v => v.idx)) + 1;

            return {
                ...prev,
                m1TotalCases: prev.m1TotalCases + 1,
                details: [
                    ...prev.details,
                    {
                        idx: nextId,

                        causeId: 0,
                        traumaId: 0,
                        jobId: 0,

                        totalCases: 1,
                        fatalCases: 0,
                        multiVictimCases: 0,

                        totalVictims: 0,
                        femaleVictims: 0,
                        fatalVictims: 0,
                        severeInjuries: 0,

                        nonManagedVictims: 0,
                        nonManagedFemaleVictims: 0,
                        nonManagedFatalVictims: 0,
                        nonManagedSevereInjuries: 0,

                        medicalCost: 0,
                        salaryCompensation: 0,
                        propertyDamage: 0,
                        totalCost: 0,

                        totalLeaveDays: 0,
                        totalDamage: 0,
                    }
                ]
            };
        });
    };

    const handleDeleteDetail = (idx: number) => {
        setSubmitForm(prev => ({
            ...prev,
            m1TotalCases: Math.max(0, prev.m1TotalCases - 1),
            details: prev.details.filter(v => v.idx !== idx),
        }));

        setError(prev => ({
            ...prev,
            details: (prev.details as Array<{ idx: number } & Record<string, string>> ?? [])
                .filter(e => e.idx !== idx)
        }));
    };

    const [report, setReport] = useState<Record<string, any[]>>()
    const inputFileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Muc 1
        // Nguyen nhan xay ra tai nan lao dong
        const nguyennhan = accidents.map(acc => {
            // Lọc các detail có cùng causeId
            const matchedDetails = submitForm.details.filter(d => Number(d.causeId) == acc.id);

            return {
                label: acc.name,
                id: acc.id,

                // Số vụ
                totalCases: matchedDetails.reduce((s, d) => s + d.totalCases, 0),
                fatalCases: matchedDetails.reduce((s, d) => s + d.fatalCases, 0),
                multiVictimCases: matchedDetails.reduce((s, d) => s + d.multiVictimCases, 0),

                // Tổng số người bị nạn
                totalVictims: matchedDetails.reduce((s, d) => s + d.totalVictims, 0),
                nonManagedVictims: matchedDetails.reduce((s, d) => s + d.nonManagedVictims, 0),

                // Số LĐ nữ
                femaleVictims: matchedDetails.reduce((s, d) => s + d.femaleVictims, 0),
                nonManagedFemaleVictims: matchedDetails.reduce((s, d) => s + d.nonManagedFemaleVictims, 0),

                // Số người bị chết
                fatalVictims: matchedDetails.reduce((s, d) => s + d.fatalVictims, 0),
                nonManagedFatalVictims: matchedDetails.reduce((s, d) => s + d.nonManagedFatalVictims, 0),

                // Số người bị thương nặng
                severeInjuries: matchedDetails.reduce((s, d) => s + d.severeInjuries, 0),
                nonManagedSevereInjuries: matchedDetails.reduce((s, d) => s + d.nonManagedSevereInjuries, 0),
            };
        });

        const yeutochanthuong = traumas.map(acc => {
            const matchedDetails = submitForm.details.filter(d => Number(d.traumaId) == acc.id);

            return {
                label: acc.name,
                id: acc.id,

                // Số vụ
                totalCases: matchedDetails.reduce((s, d) => s + d.totalCases, 0),
                fatalCases: matchedDetails.reduce((s, d) => s + d.fatalCases, 0),
                multiVictimCases: matchedDetails.reduce((s, d) => s + d.multiVictimCases, 0),

                // Tổng số người bị nạn
                totalVictims: matchedDetails.reduce((s, d) => s + d.totalVictims, 0),
                nonManagedVictims: matchedDetails.reduce((s, d) => s + d.nonManagedVictims, 0),

                // Số LĐ nữ
                femaleVictims: matchedDetails.reduce((s, d) => s + d.femaleVictims, 0),
                nonManagedFemaleVictims: matchedDetails.reduce((s, d) => s + d.nonManagedFemaleVictims, 0),

                // Số người bị chết
                fatalVictims: matchedDetails.reduce((s, d) => s + d.fatalVictims, 0),
                nonManagedFatalVictims: matchedDetails.reduce((s, d) => s + d.nonManagedFatalVictims, 0),

                // Số người bị thương nặng
                severeInjuries: matchedDetails.reduce((s, d) => s + d.severeInjuries, 0),
                nonManagedSevereInjuries: matchedDetails.reduce((s, d) => s + d.nonManagedSevereInjuries, 0),
            };
        });

        const phantheonghenghiep = jobs.map(acc => {
            const matchedDetails = submitForm.details.filter(d => Number(d.jobId) == acc.id);

            return {
                label: acc.name,
                id: acc.id,

                // Số vụ
                totalCases: matchedDetails.reduce((s, d) => s + d.totalCases, 0),
                fatalCases: matchedDetails.reduce((s, d) => s + d.fatalCases, 0),
                multiVictimCases: matchedDetails.reduce((s, d) => s + d.multiVictimCases, 0),

                // Tổng số người bị nạn
                totalVictims: matchedDetails.reduce((s, d) => s + d.totalVictims, 0),
                nonManagedVictims: matchedDetails.reduce((s, d) => s + d.nonManagedVictims, 0),

                // Số LĐ nữ
                femaleVictims: matchedDetails.reduce((s, d) => s + d.femaleVictims, 0),
                nonManagedFemaleVictims: matchedDetails.reduce((s, d) => s + d.nonManagedFemaleVictims, 0),

                // Số người bị chết
                fatalVictims: matchedDetails.reduce((s, d) => s + d.fatalVictims, 0),
                nonManagedFatalVictims: matchedDetails.reduce((s, d) => s + d.nonManagedFatalVictims, 0),

                // Số người bị thương nặng
                severeInjuries: matchedDetails.reduce((s, d) => s + d.severeInjuries, 0),
                nonManagedSevereInjuries: matchedDetails.reduce((s, d) => s + d.nonManagedSevereInjuries, 0),
            };
        });

        // Muc 2
        const record: Record<string, any[]> = {};
        record["nguyennhan"] = nguyennhan;
        record["yeutochanthuong"] = yeutochanthuong;
        record["phantheonghenghiep"] = phantheonghenghiep;

        console.log(record)

        setReport(record);

    }, [submitForm, accidents, traumas, jobs]);

    const [error, setError] = useState<Record<string, any>>({});

    const handleSave = async () => {
        try {
            setIsLoading(true);
            const cf = await confirm.waitConfirm();
            if (!cf) return;

            const mediaCls = new Media();
            const agreementCls = new Agreement()

            let fileIds: string[] = [];
            if (selectedFile) {
                const form = new FormData;
                form.set("file", selectedFile);
                form.set("fileType", "REPORT_ATTACHMENT");
                const resMedia = await mediaCls.UploadImage(form);
                fileIds = [resMedia.data!.id]
            }

            await agreementCls.UpdateReportForBussiness(id, {
                title: submitForm.title,
                year: submitForm.year,
                reportTypeId: submitForm.reportTypeId,

                totalEmployees: submitForm.totalEmployees,
                femaleEmployees: submitForm.femaleEmployees,
                totalPayroll: submitForm.totalPayroll,

                m1TotalCases: submitForm.m1TotalCases,
                m1FatalCases: submitForm.m1FatalCases,
                m1MultiVictimCases: submitForm.m1MultiVictimCases,

                m1TotalVictims: submitForm.m1TotalVictims,
                m1FemaleVictims: submitForm.m1FemaleVictims,
                m1FatalVictims: submitForm.m1FatalVictims,
                m1SevereInjuries: submitForm.m1SevereInjuries,

                m1NonManagedVictims: submitForm.m1NonManagedVictims,
                m1NonManagedFemaleVictims: submitForm.m1NonManagedFemaleVictims,
                m1NonManagedFatalVictims: submitForm.m1NonManagedFatalVictims,
                m1NonManagedSevereInjuries: submitForm.m1NonManagedSevereInjuries,

                m1MedicalCost: submitForm.m1MedicalCost,
                m1SalaryCompensation: submitForm.m1SalaryCompensation,
                m1PropertyDamage: submitForm.m1PropertyDamage,
                m1TotalCost: submitForm.m1TotalCost,

                m1TotalLeaveDays: submitForm.m1TotalLeaveDays,
                m1TotalDamage: submitForm.m1TotalDamage,

                details: submitForm.details.map(d => ({
                    "causeId": Number(d.causeId),
                    "traumaId": Number(d.traumaId),
                    "jobId": Number(d.jobId),
                    "totalCases": d.totalCases,
                    "fatalCases": d.fatalCases,
                    "multiVictimCases": d.multiVictimCases,
                    "totalVictims": d.totalVictims,
                    "femaleVictims": d.femaleVictims,
                    "fatalVictims": d.fatalVictims,
                    "severeInjuries": d.severeInjuries,
                    "nonManagedVictims": d.nonManagedVictims,
                    "nonManagedFemaleVictims": d.nonManagedFemaleVictims,
                    "nonManagedFatalVictims": d.nonManagedFatalVictims,
                    "nonManagedSevereInjuries": d.nonManagedSevereInjuries,
                    "medicalCost": d.medicalCost,
                    "salaryCompensation": d.salaryCompensation,
                    "propertyDamage": d.propertyDamage,
                    "totalCost": d.totalCost,
                    "totalLeaveDays": d.totalLeaveDays,
                    "totalDamage": d.totalDamage
                })),

                "m2TotalCases": submitForm.m2TotalCases,
                "m2FatalCases": submitForm.m2FatalCases,
                "m2MultiVictimCases": submitForm.m2MultiVictimCases,
                "m2TotalVictims": submitForm.m2TotalVictims,
                "m2FemaleVictims": submitForm.m2FemaleVictims,
                "m2FatalVictims": submitForm.m2FatalVictims,
                "m2SevereInjuries": submitForm.m2SevereInjuries,
                "m2NonManagedVictims": submitForm.m2NonManagedVictims,
                "m2NonManagedFemaleVictims": submitForm.m2NonManagedFemaleVictims,
                "m2NonManagedFatalVictims": submitForm.m2NonManagedFatalVictims,
                "m2NonManagedSevereInjuries": submitForm.m2NonManagedSevereInjuries,
                "m2MedicalCost": submitForm.m2MedicalCost,
                "m2SalaryCompensation": submitForm.m2SalaryCompensation,
                "m2PropertyDamage": submitForm.m2PropertyDamage,
                "m2TotalCost": submitForm.m2TotalCost,
                "m2TotalLeaveDays": submitForm.m2TotalLeaveDays,
                "m2TotalDamage": submitForm.m2TotalDamage,

                fileIds: fileIds,

                status: "DRAFT",
            });
            notificate?.showNotification({ type: "success", message: "Cập nhật báo cáo thành công" });

        } catch (error) {
            notificate?.showNotification({ type: "error", message: "Cập nhật báo cáo thất bại" });
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = async () => {
        let hasError = false;
        const errors: Record<string, any> = {};

        if (!submitForm.totalEmployees || submitForm.totalEmployees <= 0) {
            errors["totalEmployees"] = "Vui lòng nhập tổng số lao động của sở";
            hasError = true;
        }

        if (
            submitForm.totalEmployees > 0 &&
            submitForm.femaleEmployees > 0 &&
            submitForm.femaleEmployees > submitForm.totalEmployees
        ) {
            errors["femaleEmployees"] = "Tổng số lao động nữ không được lớn hơn tổng số lao động";
            hasError = true;
        }

        if (!submitForm.totalPayroll || submitForm.totalPayroll <= 0) {
            errors["totalPayroll"] = "Vui lòng nhập tổng quỹ lương";
            hasError = true;
        }

        if (hasError) {
            setOptionReport("business-info");
            notificate?.showNotification({ type: "error", message: "Vui lòng điền đầy đủ thông tin doanh nghiệp" });
            setError(errors);
            return;
        }

        // 2. BÁO CÁO TAI NẠN LAO ĐỘNG (Mục 1)
        let errorSection: "option-1.1" | "option-1.2" | null = null;

        // 2.1 Kiểm tra độ dài mảng details khớp tổng số vụ
        if (submitForm.m1TotalCases > 0) {
            if (submitForm.details.length !== submitForm.m1TotalCases) {
                errors["m1Details"] =
                    `Số chi tiết (${submitForm.details.length} vụ) không khớp với tổng số vụ (${submitForm.m1TotalCases} vụ). Vui lòng đồng bộ lại.`;
                hasError = true;
                errorSection = "option-1.1";
            }

            // 2.2 Kiểm tra từng chi tiết vụ tai nạn
            submitForm.details.forEach((detail) => {
                const label = `Vụ ${detail.idx + 1}`;
                const detailErrors: Record<string, string> = {};
                if (!detail.causeId || detail.causeId <= 0) {
                    detailErrors["causeId"] = `${label}: Chưa chọn nguyên nhân tai nạn`;
                }

                if (!detail.traumaId || detail.traumaId <= 0) {
                    detailErrors["traumaId"] = `${label}: Chưa chọn yếu tố chấn thương`;
                }

                if (!detail.jobId || detail.jobId <= 0) {
                    detailErrors["jobId"] = `${label}: Chưa chọn nghề nghiệp`;
                }

                if (detail.medicalCost > 0 && detail.medicalCost < 1000) {
                    detailErrors["medicalCost"] = `${label}: Chi phí y tế phải từ 1.000đ trở lên`;
                }

                if (detail.salaryCompensation > 0 && detail.salaryCompensation < 1000) {
                    detailErrors["salaryCompensation"] = `${label}: Chi phí trả lương phải từ 1.000đ trở lên`;
                }

                if (detail.propertyDamage > 0 && detail.propertyDamage < 1000) {
                    detailErrors["propertyDamage"] = `${label}: Chi phí bồi thường phải từ 1.000đ trở lên`;
                }

                if (detail.totalDamage > 0 && detail.totalDamage < 1000) {
                    detailErrors["totalDamage"] = `${label}: Thiệt hại tài sản phải từ 1.000đ trở lên`;
                }

                if (Object.keys(detailErrors).length > 0) {
                    errors.details = [
                        ...(errors.details ?? []),
                        { idx: detail.idx, ...detailErrors }
                    ];
                    hasError = true;
                    errorSection ??= "option-1.2";
                }
            });
        }

        if (hasError) {
            setOptionReport("option-1");
            if (errorSection) setOptionChild(errorSection);

            notificate?.showNotification({ type: "error", message: "Vui lòng kiểm tra lại mục 1. Tai nạn lao động" });
            setError(errors);
            setTimeout(() => setError(prev => ({ ...prev, m1Details: "" })), 5000);
            return;
        }

        // 3. BÁO CÁO TAI NẠN LAO ĐỘNG ĐIỀU KHÁC (Mục 2)
        if (submitForm.m2TotalCases > 0) {
            // Thông tin số vụ & nạn nhân
            // if (submitForm.m2FatalCases < 0) {
            //     errors["m2FatalCases"] = "Số vụ có người chết không hợp lệ";
            //     hasError = true;
            // }

            // if (submitForm.m2MultiVictimCases < 0) {
            //     errors["m2MultiVictimCases"] = "Số vụ có từ 2 người chết không hợp lệ";
            //     hasError = true;
            // }

            // if (!submitForm.m2TotalVictims || submitForm.m2TotalVictims <= 0) {
            //     errors["m2TotalVictims"] = "Vui lòng nhập tổng số người bị nạn";
            //     hasError = true;
            // }

            // if (!submitForm.m2FemaleVictims || submitForm.m2FemaleVictims <= 0) {
            //     errors["m2FemaleVictims"] = "Vui lòng nhập tổng số lao động nữ bị nạn";
            //     hasError = true;
            // }

            if (submitForm.m2FemaleVictims > submitForm.m2TotalVictims) {
                errors["m2FemaleVictims"] = "Số lao động nữ bị nạn không được lớn hơn tổng số người bị nạn";
                hasError = true;
            }

            if (submitForm.m2MedicalCost > 0 && submitForm.m2MedicalCost < 1000) {
                errors["m2MedicalCost"] = "Chi phí y tế phải từ 1.000đ trở lên";
                hasError = true;
            }

            if (submitForm.m2SalaryCompensation > 0 && submitForm.m2SalaryCompensation < 1000) {
                errors["m2SalaryCompensation"] = "Chi phí trả lương phải từ 1.000đ trở lên";
                hasError = true;
            }

            if (submitForm.m2PropertyDamage > 0 && submitForm.m2PropertyDamage < 1000) {
                errors["m2PropertyDamage"] = "Chi phí bồi thường phải từ 1.000đ trở lên";
                hasError = true;
            }

            // Tong so ngay nghi co the la 0 neu nguoi bi nan sieng di lam
            // if (!submitForm.m2TotalLeaveDays) {
            //     errors["m2TotalLeaveDays"] = "Vui lòng nhập tổng số ngày nghỉ vì TNLĐ";
            //     hasError = true;
            // }

            if (submitForm.m2TotalDamage > 0 && submitForm.m2TotalDamage < 1000) {
                errors["m2TotalDamage"] = "Thiệt hại tài sản phải từ 1.000đ trở lên";
                hasError = true;
            }
        }

        if (hasError) {
            setOptionReport("option-2");
            const firstError = Object.values(errors)[0];
            notificate?.showNotification({ type: "error", message: firstError });
            return;
        }

        if (!selectedFile) {
            setOptionReport("review-report");
            notificate?.showNotification({ type: "error", message: "Vui lòng tải file trước khi lưu" });
            return;
        }

        try {
            setIsLoading(true);

            const cf = await confirm.waitConfirm();
            if (!cf) return;

            const mediaCls = new Media();
            const agreementCls = new Agreement()
            const form = new FormData;
            form.set("file", selectedFile);
            form.set("fileType", "REPORT_ATTACHMENT");

            const resMedia = await mediaCls.UploadImage(form);
            const mediaD = resMedia.data!;

            await agreementCls.UpdateReportForBussiness(id, {
                title: submitForm.title,
                year: submitForm.year,
                reportTypeId: submitForm.reportTypeId,

                totalEmployees: submitForm.totalEmployees,
                femaleEmployees: submitForm.femaleEmployees,
                totalPayroll: submitForm.totalPayroll,

                m1TotalCases: submitForm.m1TotalCases,
                m1FatalCases: submitForm.m1FatalCases,
                m1MultiVictimCases: submitForm.m1MultiVictimCases,

                m1TotalVictims: submitForm.m1TotalVictims,
                m1FemaleVictims: submitForm.m1FemaleVictims,
                m1FatalVictims: submitForm.m1FatalVictims,
                m1SevereInjuries: submitForm.m1SevereInjuries,

                m1NonManagedVictims: submitForm.m1NonManagedVictims,
                m1NonManagedFemaleVictims: submitForm.m1NonManagedFemaleVictims,
                m1NonManagedFatalVictims: submitForm.m1NonManagedFatalVictims,
                m1NonManagedSevereInjuries: submitForm.m1NonManagedSevereInjuries,

                m1MedicalCost: submitForm.m1MedicalCost,
                m1SalaryCompensation: submitForm.m1SalaryCompensation,
                m1PropertyDamage: submitForm.m1PropertyDamage,
                m1TotalCost: submitForm.m1TotalCost,

                m1TotalLeaveDays: submitForm.m1TotalLeaveDays,
                m1TotalDamage: submitForm.m1TotalDamage,

                details: submitForm.details.map(d => ({
                    "causeId": Number(d.causeId),
                    "traumaId": Number(d.traumaId),
                    "jobId": Number(d.jobId),
                    "totalCases": d.totalCases,
                    "fatalCases": d.fatalCases,
                    "multiVictimCases": d.multiVictimCases,
                    "totalVictims": d.totalVictims,
                    "femaleVictims": d.femaleVictims,
                    "fatalVictims": d.fatalVictims,
                    "severeInjuries": d.severeInjuries,
                    "nonManagedVictims": d.nonManagedVictims,
                    "nonManagedFemaleVictims": d.nonManagedFemaleVictims,
                    "nonManagedFatalVictims": d.nonManagedFatalVictims,
                    "nonManagedSevereInjuries": d.nonManagedSevereInjuries,
                    "medicalCost": d.medicalCost,
                    "salaryCompensation": d.salaryCompensation,
                    "propertyDamage": d.propertyDamage,
                    "totalCost": d.totalCost,
                    "totalLeaveDays": d.totalLeaveDays,
                    "totalDamage": d.totalDamage
                })),

                "m2TotalCases": submitForm.m2TotalCases,
                "m2FatalCases": submitForm.m2FatalCases,
                "m2MultiVictimCases": submitForm.m2MultiVictimCases,
                "m2TotalVictims": submitForm.m2TotalVictims,
                "m2FemaleVictims": submitForm.m2FemaleVictims,
                "m2FatalVictims": submitForm.m2FatalVictims,
                "m2SevereInjuries": submitForm.m2SevereInjuries,
                "m2NonManagedVictims": submitForm.m2NonManagedVictims,
                "m2NonManagedFemaleVictims": submitForm.m2NonManagedFemaleVictims,
                "m2NonManagedFatalVictims": submitForm.m2NonManagedFatalVictims,
                "m2NonManagedSevereInjuries": submitForm.m2NonManagedSevereInjuries,
                "m2MedicalCost": submitForm.m2MedicalCost,
                "m2SalaryCompensation": submitForm.m2SalaryCompensation,
                "m2PropertyDamage": submitForm.m2PropertyDamage,
                "m2TotalCost": submitForm.m2TotalCost,
                "m2TotalLeaveDays": submitForm.m2TotalLeaveDays,
                "m2TotalDamage": submitForm.m2TotalDamage,

                fileIds: [mediaD.id],
                status: "SUBMITTED",
            });
            notificate?.showNotification({ type: "success", message: "Cập nhật báo cáo thành công" });

        } catch (error) {
            notificate?.showNotification({ type: "error", message: "Cập nhật báo cáo thất bại" });
        }
        finally {
            setIsLoading(true);
        }
    };

    const [optionReport, setOptionReport] = useState<OptionReport>("business-info");
    const [optionChild, setOptionChild] = useState<"option-1.1" | "option-1.2">("option-1.1");

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    return (
        <main className="flex flex-col min-h-screen pb-10">
            {isLoading && (
                <Loading />
            )}

            {isPrint && (
                <div className="fixed top-0 left-0 w-full h-screen bg-gray-800/50 z-100 flex justify-center py-10">
                    <ViewReport submitForm={submitForm} report={report!} onClose={() => setIsPrint(false)} />
                </div>
            )}

            <TopHero
                title="Báo cáo định kỳ tai nạn lao động"
                actions={
                    <div className="flex gap-2 items-center">
                        <div className="w-18">
                            <InputLegend
                                input={{
                                    disabled: true,
                                    value: detail?.year,
                                }}
                                isSmall={true}
                            />
                        </div>

                        <div className="flex gap-4 items-center text-xs font-semibold ps-10">
                            <button className="text-gray-400" onClick={() => router.push("/tnld-theo-hdld")}>Hủy bỏ</button>
                            {optionReport === "review-report" ? (
                                <button className="bg-white px-2 py-2 flex items-center gap-1 border-2 border-blue-600 text-blue-600 hover:bg-gray-100 rounded-lg" onClick={() => setIsPrint(true)}>
                                    <i className="fa-solid fa-print"></i>
                                    <span>In báo cáo</span>
                                </button>
                            ) : (
                                <button className="bg-white px-2 py-2 flex items-center gap-1 border-2 border-blue-600 text-blue-600 hover:bg-gray-100 rounded-lg"
                                    onClick={() => {
                                        if (optionReport === "business-info") {
                                            setOptionReport("option-1");
                                            setOptionChild("option-1.1");
                                        }
                                        else if (optionReport === "option-1" && optionChild === "option-1.1") {
                                            setOptionReport("option-1");
                                            setOptionChild("option-1.2");
                                        }
                                        else if (optionReport === "option-1" && optionChild === "option-1.2") {
                                            setOptionReport("option-2");
                                        }
                                        else if (optionReport === "option-2") {
                                            setOptionReport("review-report");
                                        }
                                    }}
                                >
                                    <i className="fa-solid fa-angle-right"></i>
                                    <span>Tiếp tục</span>
                                </button>
                            )}



                            {detail?.status === "DRAFT" && (
                                <>
                                    <button className="bg-green-600 px-4 py-2 flex items-center gap-1 border-2 border-green-600 text-white hover:bg-green-700 hover:border-green-700 rounded-lg transition-all"
                                        onClick={handleSave}
                                    >
                                        <i className="fa-regular fa-paste"></i>
                                        <span>Nháp</span>

                                    </button>
                                    <button className="bg-blue-600 px-4 py-2 flex items-center gap-1 border-2 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 rounded-lg transition-all"
                                        onClick={handleSubmit}
                                    >
                                        <i className="fa-solid fa-floppy-disk"></i>
                                        <span>Lưu</span>
                                    </button>
                                </>
                            )}

                        </div>
                    </div>
                }
                className="shrink-0"
            />

            <div className="bg-white rounded-lg border border-gray-100 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden mt-2">
                <div className="flex-1 overflow-y-auto px-8 py-6 min-h-0 space-y-5">
                    <div className="flex border-b pb-5 border-gray-300">
                        <div className="flex-2">
                            <SelectLegend
                                select={{
                                    value: optionReport,
                                    onChange: (e) => {
                                        setOptionReport(e.target.value as OptionReport);
                                    }
                                }}
                                label="Chọn mục báo cáo"
                                isSmall={true}
                            >

                                <option value={"business-info"}>Thông tin doanh nghiệp</option>
                                <option value={"option-1"}>1. Tai nạn lao động</option>
                                <option value={"option-2"}>2. Tai nạn lao động được hưởng trợ cấp theo quy định tại khoản 2 Điều 39 Luật ATVSLĐ</option>
                                <option value={"review-report"}>Xem báo cáo tổng quan</option>
                            </SelectLegend>
                        </div>
                        <div className="flex-3"></div>
                    </div>

                    {/* Bussiness Info */}
                    {optionReport === "business-info" && (
                        <div>
                            <h1 className="font-semibold text-sm">1. Thông tin công ty</h1>
                            <span className="text-sm font-semibold text-red-500">
                                *** Lưu ý: Nhập tổng quỹ lương 6 tháng khi khai báo TNLĐ 6 tháng hoặc tổng quỹ lương 12 tháng khi khai báo TNLĐ cả năm
                            </span>

                            <div className="mt-5 space-y-5">
                                <div className="flex gap-10">
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Tên công ty"
                                            input={{
                                                disabled: true,
                                                value: detail?.doet.name
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Loại hình công ty"
                                            input={{
                                                disabled: true,
                                                value: detail?.doet.businessType.name
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Loại hình công ty"
                                            input={{
                                                disabled: true,
                                                value: detail?.doet.industry.name
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-10">
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Tổng số lao động của sở"
                                            require={true}
                                            input={{
                                                type: "number",
                                                value: submitForm.totalEmployees,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, totalEmployees: num }));
                                                    setError(prev => ({ ...prev, totalEmployees: "" }))
                                                }
                                            }}
                                            isSmall={true}
                                            errorMess={error["totalEmployees"]}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Tổng số lao động nữ"
                                            require={true}
                                            input={{
                                                type: "number",
                                                value: submitForm.femaleEmployees,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, femaleEmployees: num }));
                                                    setError(prev => ({ ...prev, femaleEmployees: "" }))

                                                }
                                            }}
                                            isSmall={true}
                                            errorMess={error["femaleEmployees"]}
                                        />
                                    </div>
                                    <div className="flex-1 relative">
                                        <InputLegend
                                            label="Tổng quỹ lương"
                                            require={true}
                                            input={{
                                                type: "text",
                                                value: submitForm.totalPayroll.toLocaleString("vi-VN"),
                                                onChange: (e) => {
                                                    const value = e.target.value.replace(/\./g, "");
                                                    const n = Number(value);

                                                    if (Number.isNaN(n)) return;

                                                    setSubmitForm(prev => ({ ...prev, totalPayroll: n }));
                                                    setError(prev => ({ ...prev, totalPayroll: "" }))
                                                }
                                            }}
                                            isSmall={true}
                                            errorMess={error["totalPayroll"]}
                                        />
                                        <span className="absolute text-xs font-semibold text-gray-50 right-0 top-1/2 -translate-y-1/2 me-3">1.000 đ</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {optionReport === "option-1" && optionChild === "option-1.1" && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-5 text-sm text-[#637381] font-semibold">
                                <button className="pb-2 border-b-2 border-blue-600 text-blue-600">{"(1) Tổng số vụ tai nạn lao động"}</button>
                                <button className="pb-2 border-b-2 border-white" onClick={() => setOptionChild("option-1.2")}>{"(2) Chi tiết các vụ lao động"}</button>
                            </div>
                            <div className="text-sm space-y-3">
                                <p>
                                    **** Doanh nghiệp xảy ra tai nạn lao động vui lòng nhập theo từng bước
                                </p>
                                {error["m1Details"] && (
                                    <p className="flex justify-between items-center bg-red-50 text-red-600 px-5 py-2 ring-2 ring-red-600 font-semibold rounded">
                                        <span>{error["m1Details"]}</span>
                                        <button className="text-lg font-semibold" onClick={() => {
                                            setError(prev => ({ ...prev, m1Details: "" }));
                                        }}>
                                            <i className="fa-regular fa-calendar-xmark"></i>
                                        </button>
                                    </p>
                                )}
                            </div>
                            <div className="space-y-3">
                                <h1 className="font-semibold text-sm">1. Tổng số vụ tai nạn lao động & số nạn nhân lao động</h1>
                                <div className="space-y-6">
                                    {/* ------------------------------ */}
                                    <div className="flex gap-6">
                                        <div className="flex-1">
                                            <InputLegend
                                                label="Tổng số vụ"
                                                require={true}
                                                input={{
                                                    type: "number",
                                                    value: submitForm.m1TotalCases,
                                                    onChange: (e) => {
                                                        const num = Number(e.target.value);
                                                        if (num < 0) return;
                                                        setSubmitForm(prev => ({ ...prev, m1TotalCases: num }));
                                                    }
                                                }}
                                                isSmall={true}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <InputLegend
                                                label="Tổng số vụ có người chết"
                                                require={true}
                                                input={{
                                                    type: "number",
                                                    value: submitForm.m1FatalCases,
                                                    disabled: true
                                                }}
                                                isSmall={true}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <InputLegend
                                                label="Tổng số vụ có 2 người chết trở lên"
                                                require={true}
                                                input={{
                                                    type: "number",
                                                    value: submitForm.m1MultiVictimCases,
                                                    disabled: true
                                                }}
                                                isSmall={true}
                                            />
                                        </div>
                                        <div className="flex-1"></div>
                                    </div>
                                    {/* ------------------------------ */}
                                    <div className="flex gap-6">
                                        <div className="flex-1">
                                            <InputLegend
                                                label="Tổng số người bị nạn"
                                                require={true}
                                                input={{
                                                    type: "number",
                                                    value: submitForm.m1TotalVictims,
                                                    disabled: true
                                                }}
                                                isSmall={true}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <InputLegend
                                                label="Tổng số lao động nữ bị nạn"
                                                require={true}
                                                input={{
                                                    type: "number",
                                                    value: submitForm.m1FemaleVictims,
                                                    disabled: true
                                                }}
                                                isSmall={true}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <InputLegend
                                                label="Tổng số người chết"
                                                require={true}
                                                input={{
                                                    type: "number",
                                                    value: submitForm.m1FatalVictims,
                                                    disabled: true
                                                }}
                                                isSmall={true}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <InputLegend
                                                label="Tổng số người bị thương nặng"
                                                require={true}
                                                input={{
                                                    type: "number",
                                                    value: submitForm.m1SevereInjuries,
                                                    disabled: true
                                                }}
                                                isSmall={true}
                                            />
                                        </div>
                                    </div>
                                    {/* ------------------------------ */}
                                    <div className="flex gap-6">
                                        <div className="flex-1">
                                            <InputLegend
                                                label="Số người bị nạn không QL"
                                                require={true}
                                                input={{
                                                    type: "number",
                                                    value: submitForm.m1NonManagedVictims,
                                                    disabled: true
                                                }}
                                                isSmall={true}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <InputLegend
                                                label="Lao động nữ bị nạn không QL"
                                                require={true}
                                                input={{
                                                    type: "number",
                                                    value: submitForm.m1NonManagedFemaleVictims,
                                                    disabled: true
                                                }}
                                                isSmall={true}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <InputLegend
                                                label="Số người chết không QL"
                                                require={true}
                                                input={{
                                                    type: "number",
                                                    value: submitForm.m1NonManagedFatalVictims,
                                                    disabled: true
                                                }}
                                                isSmall={true}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <InputLegend
                                                label="Người bị thương nặng không QL"
                                                require={true}
                                                input={{
                                                    type: "number",
                                                    value: submitForm.m1NonManagedSevereInjuries,
                                                    disabled: true
                                                }}
                                                isSmall={true}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Thiệt hại do tai nạn lao động */}
                                <h1 className="font-semibold text-sm">2. Thiệt hại do tai nạn lao động</h1>
                                <div className="space-y-6">
                                    <div className="flex gap-6">
                                        <div className="flex-1">
                                            <InputLegend
                                                label="Chi phí y tế"
                                                require={true}
                                                input={{
                                                    type: "text",
                                                    value: submitForm.m1MedicalCost.toLocaleString("vi-VN"),
                                                    disabled: true
                                                }}
                                                isSmall={true}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <InputLegend
                                                label="Chi phí trả lương trong thời gian điều trị"
                                                require={true}
                                                input={{
                                                    type: "text",
                                                    value: submitForm.m1SalaryCompensation.toLocaleString("vi-VN"),
                                                    disabled: true
                                                }}
                                                isSmall={true}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <InputLegend
                                                label="Chi phí bồi thường trợ cấp"
                                                require={true}
                                                input={{
                                                    type: "text",
                                                    value: submitForm.m1PropertyDamage.toLocaleString("vi-VN"),
                                                    disabled: true
                                                }}
                                                isSmall={true}
                                            />
                                        </div>
                                        <div className="flex-1 relative">
                                            <InputLegend
                                                label="Tổng số tiền chi phí"
                                                require={true}
                                                input={{
                                                    type: "text",
                                                    value: submitForm.m1TotalCost.toLocaleString("vi-VN"),
                                                    disabled: true
                                                }}
                                                isSmall={true}
                                            />
                                            <span className="absolute text-xs font-semibold text-gray-500 right-0 top-1/2 -translate-y-1/2 me-3">1.000 đ</span>
                                        </div>
                                    </div>
                                    {/* ------------------------------ */}
                                    <div className="flex gap-6">
                                        <div className="flex-1">
                                            <InputLegend
                                                label="Tổng số ngày nghỉ vì TNLĐ"
                                                require={true}
                                                input={{
                                                    type: "number",
                                                    value: submitForm.m1TotalLeaveDays,
                                                    disabled: true
                                                }}
                                                isSmall={true}
                                            />
                                        </div>
                                        <div className="flex-1 relative">
                                            <InputLegend
                                                label="Thiệt hại tài sản"
                                                require={true}
                                                input={{
                                                    type: "text",
                                                    value: submitForm.m1TotalDamage.toLocaleString("vi-VN"),
                                                    disabled: true
                                                }}
                                                isSmall={true}
                                            />
                                            <span className="absolute text-xs font-semibold text-gray-500 right-0 top-1/2 -translate-y-1/2 me-3">1.000 đ</span>
                                        </div>
                                        <div className="flex-1"></div>
                                        <div className="flex-1"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {optionReport === "option-1" && optionChild === "option-1.2" && (
                        <div className="space-y-3 overflow-auto">
                            <div className="flex items-center gap-5 text-sm text-[#637381] font-semibold">
                                <button className="pb-2 border-b-2 border-white" onClick={() => setOptionChild("option-1.1")}>{"(1) Tổng số vụ tai nạn lao động"}</button>
                                <button className="pb-2 border-b-2 border-blue-600 text-blue-600">{"(2) Chi tiết các vụ lao động"}</button>
                            </div>
                            <div className="text-sm flex gap-5">
                                <p>**** Doanh nghiệp xảy ra tai nạn lao động vui lòng nhập theo từng bước</p>

                                <button className="flex items-center gap-2 bg-blue-50 ring-2 ring-blue-600 text-blue-600 text-xs px-2 py-1 rounded hover:bg-blue-100 font-semibold" onClick={handleSyncDetail}>
                                    <i className="fa-solid fa-arrow-rotate-right"></i>
                                    <span>Đồng bộ</span>
                                </button>

                                <button className="flex items-center gap-2 bg-green-50 ring-2 ring-green-600 text-green-600 text-xs px-2 py-1 rounded hover:bg-green-100 font-semibold" onClick={handleAddDetail}>
                                    <i className="fa-regular fa-calendar-plus"></i>
                                    <span>Thêm chi tiết</span>
                                </button>
                            </div>
                            <div className="space-y-3">
                                {submitForm.details.length === 0 ? (
                                    <div className="text-sm text-gray-400 italic">
                                        Vui lòng nhập "Tổng số vụ tai nạn lao động" ở mục (1) và ấn đồng bộ để hiển thị chi tiết.
                                    </div>
                                ) : (
                                    submitForm.details.map((detail, index) => (
                                        <DetailItem
                                            key={index}
                                            detail={detail}
                                            accidents={accidents}
                                            traumas={traumas}
                                            jobs={jobs}
                                            onChangDetail={onChangDetail}
                                            handleDeleteDetail={handleDeleteDetail}
                                            errors={(error.details as unknown as Array<{ idx: number } & Record<string, string>>)?.find(e => e.idx === detail.idx)}
                                            clearError={(idx, field) => {
                                                setError(prev => {
                                                    const currentDetails = (prev.details as unknown as Array<{ idx: number } & Record<string, string>>) ?? [];
                                                    return {
                                                        ...prev,
                                                        details: currentDetails.map(e =>
                                                            e.idx === idx ? { ...e, [field]: "" } : e
                                                        )
                                                    };
                                                });
                                            }}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {optionReport === "option-2" && (
                        <div className="space-y-5">
                            <h1 className="font-semibold text-sm">1. Tổng số vụ tai nạn lao động & số nạn nhân tai nạn lao động</h1>
                            <div className="mt-5 space-y-5">
                                <div className="flex gap-6">
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Tổng số vụ"
                                            require={true}
                                            input={{
                                                type: "number",
                                                value: submitForm.m2TotalCases,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m2TotalCases: num }));
                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Tổng số vụ có người chết"
                                            require={true}
                                            input={{
                                                type: "number",
                                                value: submitForm.m2FatalCases,
                                                disabled: true
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Tổng số vụ có 2 người chết trở lên"
                                            require={true}
                                            input={{
                                                type: "number",
                                                value: submitForm.m2MultiVictimCases,
                                                disabled: true
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1"></div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Tổng số người bị nạn"
                                            require={true}
                                            input={{
                                                type: "number",
                                                value: submitForm.m2TotalVictims,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m2TotalVictims: num }));
                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Tổng số lao động nữ bị nạn"
                                            require={true}
                                            input={{
                                                type: "number",
                                                value: submitForm.m2FemaleVictims,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m2FemaleVictims: num }));
                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Tổng số người bị chết"
                                            require={true}
                                            input={{
                                                type: "number",
                                                value: submitForm.m2FatalVictims,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m2FatalVictims: num }));
                                                    if (num > 0) {
                                                        setSubmitForm(prev => ({ ...prev, m2FatalCases: 1 }));
                                                    }
                                                    if (num <= 0) {
                                                        setSubmitForm(prev => ({ ...prev, m2FatalCases: 0 }));
                                                        setSubmitForm(prev => ({ ...prev, m2MultiVictimCases: 0 }));
                                                    }
                                                    if (num >= 2) {
                                                        setSubmitForm(prev => ({ ...prev, m2MultiVictimCases: 1 }));
                                                    }
                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Tổng số người bị thương nặng"
                                            require={true}
                                            input={{
                                                type: "number",
                                                value: submitForm.m2SevereInjuries,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m2SevereInjuries: num }));
                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Số người bị nạn không QL"
                                            require={true}
                                            input={{
                                                type: "number",
                                                value: submitForm.m2NonManagedVictims,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m2NonManagedVictims: num }));
                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Số lao đọng nữ bị nạn không QL"
                                            require={true}
                                            input={{
                                                type: "number",
                                                value: submitForm.m2NonManagedFemaleVictims,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m2NonManagedFemaleVictims: num }));
                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Số người chết không quản lý"
                                            require={true}
                                            input={{
                                                type: "number",
                                                value: submitForm.m2NonManagedFatalVictims,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m2NonManagedFatalVictims: num }));
                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Số người bị thương nặng không quản lý"
                                            require={true}
                                            input={{
                                                type: "number",
                                                value: submitForm.m2NonManagedSevereInjuries,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m2NonManagedSevereInjuries: num }));
                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                </div>
                            </div>

                            <h1 className="font-semibold text-sm">2. Thiệt hại do tai nạn lao động</h1>
                            <div className="mt-5 space-y-5">
                                <div className="flex gap-6">
                                    <div className="flex-1 relative">
                                        <InputLegend
                                            label="Chi phí y tế"
                                            require={true}
                                            input={{
                                                type: "text",
                                                value: submitForm.m2MedicalCost.toLocaleString("vi-VN"),
                                                onChange: (e) => {
                                                    const value = e.target.value.replace(/\./g, "");
                                                    const n = Number(value);

                                                    if (Number.isNaN(n)) return;

                                                    setSubmitForm(prev => ({ ...prev, m2MedicalCost: n }));
                                                    setSubmitForm(prev => ({ ...prev, m2TotalCost: n + submitForm.m2PropertyDamage + submitForm.m2SalaryCompensation }));
                                                }
                                            }}
                                            isSmall={true}
                                        />
                                        <span className="absolute text-xs font-semibold text-gray-500 right-0 top-1/2 -translate-y-1/2 me-3">1.000 đ</span>
                                    </div>
                                    <div className="flex-1 relative">
                                        <InputLegend
                                            label="Chi phí trả lương trong thời gian điều trị"
                                            require={true}
                                            input={{
                                                type: "text",
                                                value: submitForm.m2SalaryCompensation.toLocaleString("vi-VN"),
                                                onChange: (e) => {
                                                    const value = e.target.value.replace(/\./g, "");
                                                    const n = Number(value);

                                                    if (Number.isNaN(n)) return;

                                                    setSubmitForm(prev => ({ ...prev, m2SalaryCompensation: n }));
                                                    setSubmitForm(prev => ({ ...prev, m2TotalCost: n + submitForm.m2PropertyDamage + submitForm.m2MedicalCost }));
                                                }
                                            }}
                                            isSmall={true}
                                        />
                                        <span className="absolute text-xs font-semibold text-gray-500 right-0 top-1/2 -translate-y-1/2 me-3">1.000 đ</span>
                                    </div>
                                    <div className="flex-1 relative">
                                        <InputLegend
                                            label="Chi phí bồi thường trợ cấp"
                                            require={true}
                                            input={{
                                                type: "text",
                                                value: submitForm.m2PropertyDamage.toLocaleString("vi-VN"),
                                                onChange: (e) => {
                                                    const value = e.target.value.replace(/\./g, "");
                                                    const n = Number(value);

                                                    if (Number.isNaN(n)) return;

                                                    setSubmitForm(prev => ({ ...prev, m2PropertyDamage: n }));
                                                    setSubmitForm(prev => ({ ...prev, m2TotalCost: n + submitForm.m2SalaryCompensation + submitForm.m2MedicalCost }));
                                                }
                                            }}
                                            isSmall={true}
                                        />
                                        <span className="absolute text-xs font-semibold text-gray-500 right-0 top-1/2 -translate-y-1/2 me-3">1.000 đ</span>
                                    </div>
                                    <div className="flex-1 relative">
                                        <InputLegend
                                            label="Tổng số tiền chi phí"
                                            require={true}
                                            input={{
                                                type: "text",
                                                disabled: true,
                                                value: submitForm.m2TotalCost.toLocaleString("vi-VN"),
                                            }}
                                            isSmall={true}
                                        />
                                        <span className="absolute text-xs font-semibold text-gray-500 right-0 top-1/2 -translate-y-1/2 me-3">1.000 đ</span>
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Tổng số ngày nghỉ vì TNLĐ"
                                            require={true}
                                            input={{
                                                type: "number",
                                                value: submitForm.m2TotalLeaveDays,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m2TotalLeaveDays: num }));
                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1 relative">
                                        <InputLegend
                                            label="Thiệt hại tài sản"
                                            require={true}
                                            input={{
                                                type: "number",
                                                value: submitForm.m2FemaleVictims,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m2FemaleVictims: num }));
                                                }
                                            }}
                                            isSmall={true}
                                        />
                                        <span className="absolute text-xs font-semibold text-gray-500 right-0 top-1/2 -translate-y-1/2 me-3">1.000 đ</span>
                                    </div>
                                    <div className="flex-1"></div>
                                    <div className="flex-1"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {optionReport === "review-report" && (
                        <div className="space-y-3">
                            <h1 className="font-semibold text-sm">Báo cáo tổng hợp tình hình tai nạn lao động - Kỳ báo báo: {detail?.reportType.period + " năm " + detail?.reportType.year}</h1>
                            <span className="text-sm flex items-center gap-3">
                                <div className="flex gap-1">
                                    <span className="text-red-500">***</span>
                                    <span>Vui lòng đính kèm báo cáo TNLĐ có dấu mộc công ty:</span>
                                </div>
                                <div className="space-x-2">
                                    <button className="text-blue-600 underline" onClick={() => {
                                        inputFileRef.current?.click();
                                    }}>Tại đây</button>
                                    <input
                                        className="hidden"
                                        ref={inputFileRef}
                                        type="file"
                                        accept=".pdf,image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const isImage = file.type.startsWith("image/");
                                                const isPdf = file.type === "application/pdf";

                                                if (!isImage && !isPdf) {
                                                    notificate?.showNotification({ type: "error", message: "Chỉ được chọn file PDF hoặc ảnh (PNG, JPG, PDF)." });
                                                    e.target.value = "";
                                                    return;
                                                }
                                                setSelectedFile(file);
                                                notificate?.showNotification({ type: "success", message: "Tải file lên thành công" });
                                                return;
                                            }
                                            notificate?.showNotification({ type: "error", message: "Có lỗi khi tải file, vui lòng thử lại " });
                                        }}
                                    />

                                    <span className="text-blue-600" onClick={() => {
                                        if (!selectedFile) return;
                                        const url = URL.createObjectURL(selectedFile);
                                        window.open(url, "_blank");
                                    }}>
                                        {selectedFile && selectedFile.name}
                                    </span>
                                    {selectedFile && (
                                        <button className="text-red-600 underline" onClick={() => setSelectedFile(null)}>Xóa</button>
                                    )}
                                </div>
                            </span>

                            <div className="mt-5">
                                <table className="w-full text-sm border-collapse border border-gray-400 text-gray-600">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th rowSpan={4} className="border border-gray-400 p-2 text-left align-middle w-150">Tiêu chí thống kê</th>
                                            <th rowSpan={4} className="border border-gray-400 p-2 text-center align-middle">Mã số</th>
                                            <th colSpan={11} className="border border-gray-400 p-2 text-center">Phân loại TNLĐ theo mức độ thương tật</th>
                                        </tr>
                                        <tr className="bg-gray-100">
                                            <th colSpan={3} className="border border-gray-400 p-2 text-center">Số vụ</th>
                                            <th colSpan={8} className="border border-gray-400 p-2 text-center">Số người bị nạn (người)</th>
                                        </tr>
                                        <tr className="bg-gray-100">
                                            <th rowSpan={2} className="border border-gray-400 p-2 text-center align-middle">Tổng số</th>
                                            <th rowSpan={2} className="border border-gray-400 p-2 text-center align-middle">Số vụ có người chết</th>
                                            <th rowSpan={2} className="border border-gray-400 p-2 text-center align-middle">Số vụ có từ 2 người bị nạn trở lên</th>
                                            <th colSpan={2} className="border border-gray-400 p-2 text-center">Tổng số</th>
                                            <th colSpan={2} className="border border-gray-400 p-2 text-center">Số LĐ nữ</th>
                                            <th colSpan={2} className="border border-gray-400 p-2 text-center">Số người bị chết</th>
                                            <th colSpan={2} className="border border-gray-400 p-2 text-center">Số người bị thương nặng</th>
                                        </tr>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-400 p-2 text-center">Tổng số</th>
                                            <th className="border border-gray-400 p-2 text-center">NN không thuộc quyền quản lý</th>
                                            <th className="border border-gray-400 p-2 text-center">Tổng số</th>
                                            <th className="border border-gray-400 p-2 text-center">NN không thuộc quyền quản lý</th>
                                            <th className="border border-gray-400 p-2 text-center">Tổng số</th>
                                            <th className="border border-gray-400 p-2 text-center">NN không thuộc quyền quản lý</th>
                                            <th className="border border-gray-400 p-2 text-center">Tổng số</th>
                                            <th className="border border-gray-400 p-2 text-center">NN không thuộc quyền quản lý</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* rows ở đây — mỗi <tr> có 13 <td> */}
                                        <tr>
                                            <td className="font-semibold text-black py-1 ps-3" colSpan={13}>1. Tai nạn lao động</td>
                                        </tr>
                                        <tr className={"bg-white"}>
                                            <td className="border border-gray-400 p-2 ps-5">Tai nạn lao động</td>
                                            <td className="border border-gray-400 p-2 text-center"></td>
                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m1TotalCases}</td>
                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m1FatalVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m1MultiVictimCases}</td>

                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m1TotalVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m1NonManagedVictims}</td>

                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m1FemaleVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m1NonManagedFemaleVictims}</td>

                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m1FatalVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m1NonManagedFatalVictims}</td>

                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m1SevereInjuries}</td>
                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m1NonManagedSevereInjuries}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold text-black py-1 ps-3 bg-white" colSpan={13}>
                                                1.1 Phân theo nguyên nhân xảy ra TNLĐ
                                            </td>
                                        </tr>
                                        {(report?.["nguyennhan"] ?? []).map((row: any, i: number) => (
                                            <tr key={row.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-5"}>
                                                <td className="border border-gray-400 p-2 ps-5">{row.label}</td>
                                                <td className="border border-gray-400 p-2 text-center">{i + 1}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.totalCases}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.fatalCases}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.multiVictimCases}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.totalVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.nonManagedVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.femaleVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.nonManagedFemaleVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.fatalVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.nonManagedFatalVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.severeInjuries}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.nonManagedSevereInjuries}</td>
                                            </tr>
                                        ))}

                                        <tr>
                                            <td className="font-semibold text-black py-1 ps-3 bg-gray-5" colSpan={13}>
                                                1.2 Phân theo yếu tố gây chấn thương
                                            </td>
                                        </tr>
                                        {(report?.["yeutochanthuong"] ?? []).map((row: any, i: number) => (
                                            <tr key={row.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-5"}>
                                                <td className="border border-gray-400 p-2 ps-5">{row.label}</td>
                                                <td className="border border-gray-400 p-2 text-center">{i + 1}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.totalCases}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.fatalCases}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.multiVictimCases}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.totalVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.nonManagedVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.femaleVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.nonManagedFemaleVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.fatalVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.nonManagedFatalVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.severeInjuries}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.nonManagedSevereInjuries}</td>
                                            </tr>
                                        ))}

                                        <tr>
                                            <td className="font-semibold text-black py-1 ps-3 bg-gray-5" colSpan={13}>
                                                1.3 Phân theo nghề nghiệp
                                            </td>
                                        </tr>
                                        {(report?.["phantheonghenghiep"] ?? []).map((row: any, i: number) => (
                                            <tr key={row.id} className={i % 2 === 0 ? "bg-white" : "bg-white"}>
                                                <td className="border border-gray-400 p-2 ps-5">{row.label}</td>
                                                <td className="border border-gray-400 p-2 text-center">{i + 1}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.totalCases}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.fatalCases}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.multiVictimCases}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.totalVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.nonManagedVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.femaleVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.nonManagedFemaleVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.fatalVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.nonManagedFatalVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.severeInjuries}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.nonManagedSevereInjuries}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td className="font-semibold text-black py-1 ps-3 bg-white" colSpan={13}>
                                                2. Tai nạn được hưởng trợ cấp theo quy định Khoản 2 Điều 39 Luật ATVSLĐ
                                            </td>
                                        </tr>
                                        <tr className={"bg-white"}>
                                            <td className="border border-gray-400 p-2 ps-5">Tai nạn được hưởng trợ cấp theo quy định Khoản 2 Điều 39 Luật ATVSLĐ</td>
                                            <td className="border border-gray-400 p-2 text-center"></td>
                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m2TotalCases}</td>
                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m2FatalCases}</td>
                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m2MultiVictimCases}</td>

                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m2TotalVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m2NonManagedVictims}</td>

                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m2FemaleVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m2NonManagedFemaleVictims}</td>

                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m2FatalVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m2NonManagedFatalVictims}</td>

                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m2SevereInjuries}</td>
                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m2NonManagedSevereInjuries}</td>
                                        </tr>

                                        <tr>
                                            <td className="font-semibold text-black py-1 ps-3 bg-white" colSpan={13}>
                                                3. Tổng số
                                            </td>
                                        </tr>

                                        <tr className={"bg-white"}>
                                            <td className="border border-gray-400 p-2 ps-5">Tổng số 3 = 1 + 2</td>
                                            <td className="border border-gray-400 p-2 text-center"></td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {submitForm.m1TotalCases + submitForm.m2TotalCases}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {submitForm.m1FatalCases + submitForm.m2FatalCases}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {submitForm.m1MultiVictimCases + submitForm.m2MultiVictimCases}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {submitForm.m1TotalVictims + submitForm.m2TotalVictims}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {submitForm.m1NonManagedVictims + submitForm.m2NonManagedVictims}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {submitForm.m1FemaleVictims + submitForm.m2FemaleVictims}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {submitForm.m1NonManagedFemaleVictims + submitForm.m2NonManagedFemaleVictims}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {submitForm.m1FatalVictims + submitForm.m2FatalVictims}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {submitForm.m1NonManagedFatalVictims + submitForm.m2NonManagedFatalVictims}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {submitForm.m1SevereInjuries + submitForm.m2SevereInjuries}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {submitForm.m1NonManagedSevereInjuries + submitForm.m2NonManagedSevereInjuries}
                                            </td>
                                        </tr>
                                        {/* Bruh */}
                                        <tr>
                                            <td className="font-semibold text-black py-1 ps-3 bg-white" colSpan={13}>
                                                Thiệt hại do tai nạn lao động
                                            </td>
                                        </tr>

                                        <tr className="bg-gray-100 font-semibold">
                                            <td className="border border-gray-400 p-2 text-center" rowSpan={3}>Tổng số ngày nghỉ vì tai nạn lao động (kể cả chế độ)</td>
                                            <td className="border border-gray-400 p-2 text-center" colSpan={11}>Tổng số ngày nghỉ vì TNLĐ (1.000đ)</td>
                                            <td className="border border-gray-400 p-2 text-center" rowSpan={3}>
                                                Thiệt hại tài sản
                                                (1.000đ)
                                            </td>
                                        </tr>
                                        <tr className="bg-gray-100 font-semibold">
                                            <td className="border border-gray-400 p-2 text-center" rowSpan={2} colSpan={2}>Tổng số</td>
                                            <td className="border border-gray-400 p-2 text-center" rowSpan={1} colSpan={9}>Khoản chi cụ thể của cơ sở</td>
                                        </tr>
                                        <tr className="bg-gray-100 font-semibold">
                                            <td className="border border-gray-400 p-2 text-center" colSpan={3}>Y tế</td>
                                            <td className="border border-gray-400 p-2 text-center" colSpan={3}>Trả lương trong thời gian điều trị</td>
                                            <td className="border border-gray-400 p-2 text-center" colSpan={3}>Bồi thường trợ cấp</td>
                                        </tr>

                                        <tr>
                                            <td className="border border-gray-400 p-2 text-center" >{submitForm.m1TotalLeaveDays + submitForm.m2TotalLeaveDays}</td>
                                            <td className="border border-gray-400 p-2 text-center" colSpan={2}>{(submitForm.m1TotalDamage + submitForm.m2TotalDamage).toLocaleString("vi-VN")}</td>
                                            <td className="border border-gray-400 p-2 text-center" colSpan={3}>{(submitForm.m1MedicalCost + submitForm.m2MedicalCost).toLocaleString("vi-VN")}</td>
                                            <td className="border border-gray-400 p-2 text-center" colSpan={3}>{(submitForm.m1SalaryCompensation + submitForm.m2SalaryCompensation).toLocaleString("vi-VN")}</td>
                                            <td className="border border-gray-400 p-2 text-center" colSpan={3}>{(submitForm.m1PropertyDamage + submitForm.m2PropertyDamage).toLocaleString("vi-VN")}</td>
                                            <td className="border border-gray-400 p-2 text-center" >{(submitForm.m1PropertyDamage + submitForm.m2PropertyDamage).toLocaleString("vi-VN")}</td>
                                            {/* <td className="border border-gray-400 p-2 text-center">{(submitForm.m1TotalCost + submitForm.m2TotalCost).toLocaleString("vi-VN")}</td> */}
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}

export default TNLDTheoHDLDIdPage;