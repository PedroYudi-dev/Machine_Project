from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()

# Liberar acesso do React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Carregar modelo e features
model = joblib.load('model/model.pkl')
features = joblib.load('model/features.pkl')

# Schema do cliente
class Cliente(BaseModel):
    SeniorCitizen: int
    Partner: str
    Dependents: str
    tenure: int
    MultipleLines: str
    InternetService: str
    OnlineSecurity: str
    OnlineBackup: str
    DeviceProtection: str
    TechSupport: str
    StreamingTV: str
    StreamingMovies: str
    Contract: str
    PaperlessBilling: str
    PaymentMethod: str
    MonthlyCharges: float
    TotalCharges: float

# ========================
# ENDPOINTS
# ========================

@app.get("/")
def home():
    return {"status": "API funcionando! ✅"}

# Estamos listando o tudo sobre os do dataSet
@app.get("/clientes")
def listar_clientes():
    df = pd.read_csv('data/WA_Fn-UseC_-Telco-Customer-Churn.csv')
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
    df.dropna(inplace=True)
    df_model = df.drop('customerID', axis=1)
    df_model['Churn'] = df_model['Churn'].map({'Yes': 1, 'No': 0})
    df_model = pd.get_dummies(df_model)
    df_model = df_model.reindex(columns=features, fill_value=0)
    probs = model.predict_proba(df_model)[:, 1]
    resultado = []
    for i, prob in enumerate(probs):
        resultado.append({
            "customerID": df['customerID'].iloc[i],
            "probabilidade_churn": round(float(prob), 2),
            "risco": "Alto" if prob > 0.5 else "Baixo"
        })
    return resultado

@app.get("/cliente/{customer_id}")
def buscar_cliente(customer_id: str):
    df = pd.read_csv('data/WA_Fn-UseC_-Telco-Customer-Churn.csv')
    cliente = df[df['customerID'] == customer_id]
    if cliente.empty:
        return {"erro": "Cliente não encontrado!"}
    df_model = cliente.drop('customerID', axis=1)
    df_model['TotalCharges'] = pd.to_numeric(df_model['TotalCharges'], errors='coerce')
    df_model['Churn'] = df_model['Churn'].map({'Yes': 1, 'No': 0})
    df_model = pd.get_dummies(df_model)
    df_model = df_model.reindex(columns=features, fill_value=0)
    prob = model.predict_proba(df_model)[0][1]
    risco = "Alto" if prob > 0.5 else "Baixo"
    return {
        "customerID": customer_id,
        "probabilidade_churn": round(float(prob), 2),
        "risco": risco,
        "acao": "⚠️ Acionar time de retenção!" if risco == "Alto" else "✅ Cliente estável"
    }

@app.post("/prever")
def prever(cliente: Cliente):
    df = pd.DataFrame([cliente.model_dump()])
    df = pd.get_dummies(df)
    df = df.reindex(columns=features, fill_value=0)
    prob = model.predict_proba(df)[0][1]
    risco = "Alto" if prob > 0.5 else "Baixo"
    return {
        "probabilidade_churn": round(float(prob), 2),
        "risco": risco,
        "acao": "⚠️ Acionar time de retenção!" if risco == "Alto" else "✅ Cliente estável"
    }

# Aqui vamos rodar os graficos
@app.get("/dashboard/resumo")
def resumo():
    df = pd.read_csv('data/WA_Fn-UseC_-Telco-Customer-Churn.csv')
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
    df.dropna(inplace=True)
    df_model = df.drop('customerID', axis=1)
    df_model['Churn'] = df_model['Churn'].map({'Yes': 1, 'No': 0})
    df_model = pd.get_dummies(df_model)
    df_model = df_model.reindex(columns=features, fill_value=0)
    probs = model.predict_proba(df_model)[:, 1]
    total = len(probs)
    alto = sum(1 for p in probs if p > 0.5)
    baixo = total - alto
    return {
        "total": total,
        "alto_risco": alto,
        "baixo_risco": baixo,
        "pct_alto": round(alto / total * 100, 1),
        "pct_baixo": round(baixo / total * 100, 1),
        "media_churn": round(float(probs.mean()), 2)
    }

@app.get("/dashboard/top10")
def top10():
    df = pd.read_csv('data/WA_Fn-UseC_-Telco-Customer-Churn.csv')
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
    df.dropna(inplace=True)
    df_model = df.drop('customerID', axis=1)
    df_model['Churn'] = df_model['Churn'].map({'Yes': 1, 'No': 0})
    df_model = pd.get_dummies(df_model)
    df_model = df_model.reindex(columns=features, fill_value=0)
    probs = model.predict_proba(df_model)[:, 1]
    df['probabilidade_churn'] = probs
    top = df.nlargest(10, 'probabilidade_churn')[['customerID', 'probabilidade_churn']]
    return top.to_dict(orient='records')

@app.get("/dashboard/contrato")
def por_contrato():
    df = pd.read_csv('data/WA_Fn-UseC_-Telco-Customer-Churn.csv')
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
    df.dropna(inplace=True)
    df_model = df.drop('customerID', axis=1)
    df_model['Churn'] = df_model['Churn'].map({'Yes': 1, 'No': 0})
    df_model = pd.get_dummies(df_model)
    df_model = df_model.reindex(columns=features, fill_value=0)
    probs = model.predict_proba(df_model)[:, 1]
    df['probabilidade_churn'] = probs
    resultado = df.groupby('Contract')['probabilidade_churn'].mean().reset_index()
    resultado.columns = ['contrato', 'media_churn']
    resultado['media_churn'] = resultado['media_churn'].round(2)
    return resultado.to_dict(orient='records')

@app.get("/dashboard/tenure")
def por_tenure():
    df = pd.read_csv('data/WA_Fn-UseC_-Telco-Customer-Churn.csv')
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
    df.dropna(inplace=True)
    df_model = df.drop('customerID', axis=1)
    df_model['Churn'] = df_model['Churn'].map({'Yes': 1, 'No': 0})
    df_model = pd.get_dummies(df_model)
    df_model = df_model.reindex(columns=features, fill_value=0)
    probs = model.predict_proba(df_model)[:, 1]
    df['probabilidade_churn'] = probs
    resultado = df.groupby('tenure')['probabilidade_churn'].mean().reset_index()
    resultado.columns = ['tenure', 'media_churn']
    resultado['media_churn'] = resultado['media_churn'].round(2)
    return resultado.to_dict(orient='records')