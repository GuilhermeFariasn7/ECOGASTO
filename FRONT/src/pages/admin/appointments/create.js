import NavAdmin from '@/components/NavAdmin';
import MenuUsers from '@/components/MenuUsers'; 
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import { useRouter } from 'next/router';

export default function CreateAppointment() {
    const API_URL = "http://localhost:8080/api/appointment";
    const STUDENTS_API_URL = "http://localhost:8080/api/student";
    const PROFESSIONALS_API_URL = "http://localhost:8080/api/professional";

    const router = useRouter();

    const [appointment, setAppointment] = useState({
        studentName: "",
        professionalName: "",
        professionalSpecialty: "",  
        date: "",
        time: "",
        description: "",
    });

    const [students, setStudents] = useState([]);
    const [professionals, setProfessionals] = useState([]);
    const [message, setMessage] = useState({ message: "", status: "" });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        async function fetchData() {
            try {
                const [studentsResponse, professionalsResponse] = await Promise.all([
                    Axios.get(STUDENTS_API_URL),
                    Axios.get(PROFESSIONALS_API_URL),
                ]);

                setStudents(studentsResponse.data.students || []);
                setProfessionals(professionalsResponse.data.professionals || []);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            }
        }
        fetchData();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setAppointment({
            ...appointment,
            [name]: value,
        });
        if (value.trim()) {
            setErrors({ ...errors, [name]: false });
        }
    };

    const handleProfessionalChange = (event) => {
        const { value } = event.target;
        const professional = professionals.find(prof => prof.name === value);
        setAppointment({
            ...appointment,
            professionalName: value,
            professionalSpecialty: professional ? professional.specialty : "",  
        });
    };

    const validateFields = () => {
        const newErrors = {};
        if (!appointment.studentName.trim()) newErrors.studentName = true;
        if (!appointment.professionalName.trim()) newErrors.professionalName = true;
        if (!appointment.date.trim()) newErrors.date = true;
        if (!appointment.time.trim()) newErrors.time = true;
        if (!appointment.description.trim()) newErrors.description = true;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateAppointment = async () => {
        if (!validateFields()) {
            setMessage({
                message: "Por favor, preencha todos os campos obrigatórios.",
                status: "error",
            });
            return;
        }

        const appointmentData = {
            student: appointment.studentName,
            professional: appointment.professionalName,
            specialty: appointment.professionalSpecialty,  
            date: `${appointment.date}T${appointment.time}:00`,
            comments: appointment.description,
        };

        try {
            const response = await Axios.post(API_URL, appointmentData);
            if (response.status === 200) {
                setMessage({ message: "Agendamento salvo com sucesso!", status: "ok" });
                router.push('/admin/appointments');
            }
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.msg || "Erro desconhecido.";
                setMessage({ message: errorMessage, status: "error" });
            } else {
                setMessage({ message: "Erro ao criar o agendamento!", status: "error" });
            }
        }
    };

    return (
        <>
            <Head>
                <title>APP-BC</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div>
                <NavAdmin />
                <MenuUsers />
            </div>

            <div className="container mt-2">
                {message.status === "ok" && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">{message.message}</div>)}
                {message.status === "error" && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">{message.message}</div>)}
            </div>

    <div className="d-flex justify-content-center ">
        <div className="container">
            <div className="row border-bottom fw-bold">
                <h3 className='fw-bold text-center'> CADASTRO DE AGENDAMENTO</h3>
                        <form method="POST">
                            <div className="form-group">
                                <label className="form-label mt-2 mb-0" htmlFor="studentName">Estudante <span className="text-danger">*</span></label>
                                <select
                                    className={`form-select ${errors.studentName ? 'is-invalid' : ''}`}
                                    id="studentName"
                                    name="studentName"
                                    value={appointment.studentName}
                                    onChange={handleChange}>
                                    <option value="">Selecione um estudante</option>
                                    {students.map(student => (
                                        <option key={student.name} value={student.name}>
                                            {student.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label mt-2 mb-0" htmlFor="professionalName">Profissional <span className="text-danger">*</span></label>
                                <select
                                    className={`form-select ${errors.professionalName ? 'is-invalid' : ''}`}
                                    id="professionalName"
                                    name="professionalName"
                                    value={appointment.professionalName}
                                    onChange={handleProfessionalChange}>
                                    <option value="">Selecione um profissional</option>
                                    {professionals.map(professional => (
                                        <option key={professional.name} value={professional.name}>
                                            {professional.name} - {professional.specialty}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {appointment.professionalSpecialty && (
                                <div className="form-group">
                                    <label className="form-label mt-2 mb-0">Especialidade:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={appointment.professionalSpecialty}
                                        disabled/>
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label mt-2 mt-0" htmlFor="date">Data <span className="text-danger">*</span></label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                                    value={appointment.date}
                                    onChange={handleChange}/>
                            </div>

                            <div className="form-group">
                                <label className="form-label mt-2 mb-0" htmlFor="time">Hora <span className="text-danger">*</span></label>
                                <input
                                    type="time"
                                    id="time"
                                    name="time"
                                    className={`form-control ${errors.time ? 'is-invalid' : ''}`}
                                    value={appointment.time}
                                    onChange={handleChange}/>
                            </div>

                            <div className="form-group">
                                <label className="form-label mt-2 mb-0" htmlFor="description">Descrição <span className="text-danger">*</span></label>
                                <textarea
                                    id="description"
                                    name="description"
                                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                    value={appointment.description}
                                    onChange={handleChange}></textarea>
                            </div>

                            <div className="form-group p-2">
                                <button className="btn btn-success mx-1 fw-bold" type="button" onClick={handleCreateAppointment}>SALVAR</button>
                                <Link className="btn btn-secondary text-white mx-1 fw-bold" href="/admin/">VOLTAR</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
