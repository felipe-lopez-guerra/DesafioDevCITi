import { Request, Response } from "express";
import { Luminosidade } from "@prisma/client";
import * as PlantaRepository from "@repositories/PlantaRepository";

type DadosPlanta = {
  nome?: unknown;
  especie?: unknown;
  preco?: unknown;
  estoque?: unknown;
  luminosidade?: unknown;
  petFriendly?: unknown;
  regaACadaDias?: unknown;
};

type DadosPlantaValidos = {
  nome: string;
  especie: string;
  preco: number;
  estoque: number;
  luminosidade: Luminosidade;
  petFriendly: boolean;
  regaACadaDias: number;
};

// Retorna a mensagem de erro ou null.
const validarPlanta = (dados: DadosPlanta): string | null => {
  const { nome, especie, preco, estoque, luminosidade, petFriendly, regaACadaDias } = dados;

  if (nome !== undefined && (typeof nome !== "string" || nome.trim() === "")) {
    return "nome deve ser um texto não vazio.";
  }

  if (especie !== undefined && (typeof especie !== "string" || especie.trim() === "")) {
    return "especie deve ser um texto não vazio.";
  }

  if (preco !== undefined && (!Number.isInteger(preco) || (preco as number) <= 0)) {
    return "preco deve ser um inteiro maior que zero (em centavos).";
  }

  if (estoque !== undefined && (!Number.isInteger(estoque) || (estoque as number) < 0)) {
    return "estoque deve ser um inteiro maior ou igual a zero.";
  }

  if (
    luminosidade !== undefined &&
    !Object.values(Luminosidade).includes(luminosidade as Luminosidade)
  ) {
    return "luminosidade deve ser SOMBRA, MEIA_SOMBRA ou SOL_PLENO.";
  }

  if (petFriendly !== undefined && typeof petFriendly !== "boolean") {
    return "petFriendly deve ser true ou false.";
  }

  if (
    regaACadaDias !== undefined &&
    (!Number.isInteger(regaACadaDias) || (regaACadaDias as number) < 1)
  ) {
    return "regaACadaDias deve ser um inteiro maior ou igual a 1.";
  }

  return null;
};

export const createPlanta = async (req: Request, res: Response) => {
  try {
    const { nome, especie, preco, estoque, luminosidade, petFriendly, regaACadaDias } = req.body;


    if (
      nome === undefined ||
      especie === undefined ||
      preco === undefined ||
      estoque === undefined ||
      luminosidade === undefined ||
      petFriendly === undefined ||
      regaACadaDias === undefined
    ) {
      return res.status(400).json({
        message:
          "Preencha nome, especie, preco, estoque, luminosidade, petFriendly e regaACadaDias.",
      });
    }


    const erro = validarPlanta({
      nome,
      especie,
      preco,
      estoque,
      luminosidade,
      petFriendly,
      regaACadaDias,
    });
    if (erro) {
      return res.status(400).json({ message: erro });
    }

    const planta = await PlantaRepository.createPlanta({
      nome: nome,
      especie: especie,
      preco: preco,
      estoque: estoque,
      luminosidade: luminosidade,
      petFriendly: petFriendly,
      regaACadaDias: regaACadaDias,
    });


    return res.status(201).json(planta);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Erro ao criar planta." });
  }
};

export const readAllPlantas = async (req: Request, res: Response) => {
  try {

    const { luminosidade, petFriendly } = req.query;


    if (
      luminosidade !== undefined &&
      !Object.values(Luminosidade).includes(luminosidade as Luminosidade)
    ) {
      return res.status(400).json({
        message: "luminosidade deve ser SOMBRA, MEIA_SOMBRA ou SOL_PLENO.",
      });
    }


    if (petFriendly !== undefined && petFriendly !== "true" && petFriendly !== "false") {
      return res.status(400).json({ message: "petFriendly deve ser true ou false." });
    }


    const plantas = await PlantaRepository.findAllPlantas({
      luminosidade: luminosidade as Luminosidade | undefined,
      petFriendly: petFriendly === undefined ? undefined : petFriendly === "true",
    });


    return res.status(200).json(plantas);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar plantas." });
  }
};

export const readPlantaById = async (req: Request, res: Response) => {
  try {

    const id = Number(req.params.id);


    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Id inválido." });
    }

    const planta = await PlantaRepository.findPlantaById(id);


    if (!planta) {
      return res.status(404).json({ message: "Planta não encontrada." });
    }

    return res.status(200).json(planta);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar planta." });
  }
};

export const updatePlanta = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { nome, especie, preco, estoque, luminosidade, petFriendly, regaACadaDias } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Id inválido." });
    }


    const erro = validarPlanta({
      nome,
      especie,
      preco,
      estoque,
      luminosidade,
      petFriendly,
      regaACadaDias,
    });
    if (erro) {
      return res.status(400).json({ message: erro });
    }

    const planta = await PlantaRepository.findPlantaById(id);

    if (!planta) {
      return res.status(404).json({ message: "Planta não encontrada." });
    }

    const updatedPlanta = await PlantaRepository.updatePlanta(id, {
      nome: nome,
      especie: especie,
      preco: preco,
      estoque: estoque,
      luminosidade: luminosidade,
      petFriendly: petFriendly,
      regaACadaDias: regaACadaDias,
    });

    return res.status(200).json(updatedPlanta);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao atualizar planta." });
  }
};

export const deletePlanta = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Id inválido." });
    }

    const planta = await PlantaRepository.findPlantaById(id);

    if (!planta) {
      return res.status(404).json({ message: "Planta não encontrada." });
    }

    await PlantaRepository.deletePlanta(id);

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao deletar planta." });
  }
};

export const venderPlanta = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { quantidade } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Id inválido." });
    }

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      return res.status(400).json({ message: "quantidade deve ser um inteiro maior que zero." });
    }


    const planta = await PlantaRepository.findPlantaById(id);

    if (!planta) {
      return res.status(404).json({ message: "Planta não encontrada." });
    }


    if (planta.estoque < quantidade) {
      return res.status(400).json({
        message: `Estoque insuficiente. Temos só ${planta.estoque} vasos.`,
      });
    }

    const plantaAtualizada = await PlantaRepository.decrementEstoque(id, quantidade);

    return res.status(200).json(plantaAtualizada);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao vender planta." });
  }
};

export const readValorTotalEstoque = async (req: Request, res: Response) => {
  try {

    const plantas = await PlantaRepository.findPrecoEEstoque();

    const valorTotalEmCentavos = plantas.reduce(
      (total, planta) => total + planta.preco * planta.estoque,
      0,
    );
    const totalDeVasos = plantas.reduce((total, planta) => total + planta.estoque, 0);


    return res.status(200).json({ valorTotalEmCentavos, totalDeVasos });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao calcular valor do estoque." });
  }
};