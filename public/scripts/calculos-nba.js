// Función para calcular apuesta
function calcularApuesta(localTeam, visitorTeam) {
    console.log('Calculando apuesta para:', localTeam, visitorTeam);
    const localStats = findTeamData(localTeam);
    const visitorStats = findTeamData(visitorTeam);
    if (!localStats || !visitorStats) {
        console.log('Datos de equipos no encontrados:', localStats, visitorStats);
        return "Por favor, selecciona equipos válidos.";
    }
    const localPF = parseFloat(localStats.points_for);
    const visitorPF = parseFloat(visitorStats.points_for);
    const localPA = parseFloat(localStats.points_against);
    const visitorPA = parseFloat(visitorStats.points_against);
    const localWins = parseInt(localStats.wins);
    const visitorWins = parseInt(visitorStats.wins);
    const localLosses = parseInt(localStats.losses);
    const visitorLosses = parseInt(visitorStats.losses);
    let localWinPct = parseFloat(localStats.win_percentage);
    let visitorWinPct = parseFloat(visitorStats.win_percentage);
    if (localWinPct > 1) localWinPct = localWinPct / 100;
    if (visitorWinPct > 1) visitorWinPct = visitorWinPct / 100;
    const localAvgPF = localPF;
    const visitorAvgPF = visitorPF;
    const localAvgPA = localPA;
    const visitorAvgPA = visitorPA;
    const localNetRating = localAvgPF - localAvgPA;
    const visitorNetRating = visitorAvgPF - visitorAvgPA;
    const localGames = localWins + localLosses;
    const visitorGames = visitorWins + visitorLosses;
    const localForm = localWinPct > 0.6 ? "Excelente" : localWinPct > 0.5 ? "Buena" : localWinPct > 0.4 ? "Regular" : "Mala";
    const visitorForm = visitorWinPct > 0.6 ? "Excelente" : visitorWinPct > 0.5 ? "Buena" : visitorWinPct > 0.4 ? "Regular" : "Mala";
    const getTeamTier = (winPct) => {
        if (winPct >= 0.65) return "Elite";
        if (winPct >= 0.55) return "Playoff";
        if (winPct >= 0.45) return "Promedio";
        if (winPct >= 0.35) return "Reconstrucción";
        return "Perdedor";
    };
    const localTier = getTeamTier(localWinPct);
    const visitorTier = getTeamTier(visitorWinPct);
    const localPace = localAvgPF + localAvgPA;
    const visitorPace = visitorAvgPF + visitorAvgPA;
    const avgPace = (localPace + visitorPace) / 2;
    const getPlayStyle = (pace, avgPF) => {
        if (pace > 225 && avgPF > 115) return "Run & Gun";
        if (pace > 220) return "Ritmo Alto";
        if (pace < 200 && avgPF < 105) return "Grind-it-out";
        if (pace < 205) return "Ritmo Lento";
        if (avgPF > 115) return "Ofensivo";
        if (avgPF < 105) return "Defensivo";
        return "Balanceado";
    };
    const localStyle = getPlayStyle(localPace, localAvgPF);
    const visitorStyle = getPlayStyle(visitorPace, visitorAvgPF);
    const getHomeAdvantage = (team, teamStats) => {
        const strongHomeTeams = ["Boston Celtics", "Miami Heat", "Phoenix Suns", "Denver Nuggets", "Utah Jazz"];
        const weakHomeTeams = ["Brooklyn Nets", "LA Clippers", "Washington Wizards"];
        let baseAdvantage = 3.0;
        if (strongHomeTeams.includes(team)) baseAdvantage = 3.5;
        if (weakHomeTeams.includes(team)) baseAdvantage = 2.5;
        const winPct = parseFloat(teamStats.win_percentage);
        const adjustedWinPct = winPct > 1 ? winPct / 100 : winPct;
        if (adjustedWinPct > 0.7) baseAdvantage += 0.5;
        if (adjustedWinPct < 0.3) baseAdvantage -= 0.5;
        return Math.max(2.0, Math.min(4.0, baseAdvantage));
    };
    const ventajaLocal = getHomeAdvantage(localTeam, localStats);
    const netRatingDiff = localNetRating - visitorNetRating;
    const winPctDiff = localWinPct - visitorWinPct;
    let spread = 0;
    spread += ventajaLocal;
    spread += netRatingDiff * 0.25;
    spread += winPctDiff * 5;
    const minSpread = 2.0;
    if (Math.abs(spread) < minSpread) {
        const localAdvantage = localWinPct + (localNetRating * 0.01) + (ventajaLocal * 0.01);
        const visitorAdvantage = visitorWinPct + (visitorNetRating * 0.01);
        if (localAdvantage > visitorAdvantage) {
            spread = Math.max(spread, minSpread);
        } else {
            spread = Math.min(spread, -minSpread);
        }
    }
    spread = Math.max(-12, Math.min(12, spread));
    if (Math.abs(spread) < 3) {
        spread = spread > 0 ? 2.5 : -2.5;
    } else if (Math.abs(spread) > 8) {
        spread = spread > 0 ? 8 : -8;
    }
    spread = roundToHalf(spread);
    const qualityDifference = Math.abs(localWinPct - visitorWinPct);
    if (qualityDifference > 0.3) {
        const adjustment = qualityDifference > 0.4 ? 1.5 : 1.0;
        if (localWinPct > visitorWinPct) {
            spread = Math.max(spread, adjustment);
        } else {
            spread = Math.min(spread, -adjustment);
        }
    }
    spread = Math.max(-10, Math.min(10, spread));
    spread = roundToHalf(spread);
    if (Math.abs(spread) < 2) {
        spread = spread >= 0 ? 2 : -2;
    }
    const localSpread = -spread;
    const visitorSpread = spread;
    const localPredicted = roundToHalf(
        localAvgPF + (ventajaLocal * 0.4) + ((localAvgPF - visitorAvgPA) * 0.1)
    );
    const visitorPredicted = roundToHalf(
        visitorAvgPF - (ventajaLocal * 0.3) + ((visitorAvgPF - localAvgPA) * 0.1)
    );
    const totalPredicted = localPredicted + visitorPredicted;
    const paceAdjustment = avgPace > 220 ? 2 : avgPace < 200 ? -2 : 0;
    const finalTotal = roundToHalf(totalPredicted + paceAdjustment);
    const spreadConfidence = Math.abs(winPctDiff) > 0.2 ? "Alta" : Math.abs(winPctDiff) > 0.1 ? "Media" : "Baja";
    const totalConfidence = Math.abs(avgPace - 215) > 15 ? "Alta" : "Media";
    const favorito = spread > 0 ? localTeam : visitorTeam;
    const underdog = spread > 0 ? visitorTeam : localTeam;
    const qualityGap = Math.abs(localWinPct - visitorWinPct);
    const netRatingGap = Math.abs(localNetRating - visitorNetRating);
    let extraPoints = 2;
    if (qualityGap > 0.4) {
        extraPoints = 8;
    } else if (qualityGap > 0.3) {
        extraPoints = 6;
    } else if (qualityGap > 0.2) {
        extraPoints = 4;
    } else if (qualityGap > 0.1) {
        extraPoints = 3;
    } else {
        extraPoints = 2;
    }
    if (netRatingGap > 8) {
        extraPoints += 2;
    } else if (netRatingGap > 5) {
        extraPoints += 1;
    }
    const favoritoTier = getTeamTier(favorito === localTeam ? localWinPct : visitorWinPct);
    const underdogTier = getTeamTier(favorito === localTeam ? visitorWinPct : localWinPct);
    if (favoritoTier === "Elite" && underdogTier === "Perdedor") {
        extraPoints += 2;
    } else if (favoritoTier === "Elite" && underdogTier === "Reconstrucción") {
        extraPoints += 1;
    } else if (favoritoTier === "Playoff" && underdogTier === "Perdedor") {
        extraPoints += 1;
    }
    extraPoints = Math.max(2, Math.min(10, extraPoints));
    extraPoints = roundToHalf(extraPoints);
    const favoritoSpread = Math.abs(spread) * -1;
    const underdogSpread = Math.abs(spread) + extraPoints;
    const specialSituations = [];
    if (Math.abs(localWinPct - visitorWinPct) < 0.05) {
        specialSituations.push("🎯 Equipos muy parejos - Juego cerrado");
    }
    if (localNetRating > 5 && visitorNetRating < -2) {
        specialSituations.push("⚡ Ventaja ofensiva/defensiva significativa");
    }
    if (avgPace > 225) {
        specialSituations.push("🔥 Ritmo de juego muy alto esperado");
    } else if (avgPace < 200) {
        specialSituations.push("🐌 Ritmo de juego lento esperado");
    }
    if (localStyle === "Run & Gun" && visitorStyle === "Grind-it-out") {
        specialSituations.push("🎭 Choque de estilos contrastantes");
    }
    const recommendations = [];
    if (spreadConfidence === "Alta" && Math.abs(spread) >= 3) {
        const bestBet = favorito === localTeam ?
            `${localTeam} ${favoritoSpread}` :
            `${visitorTeam} ${favoritoSpread}`;
        recommendations.push(`💰 HANDICAP: ${bestBet}`);
    }
    if (totalConfidence === "Alta") {
        if (avgPace > 220) {
            recommendations.push(`📈 OVER ${finalTotal - 1} puntos`);
        } else if (avgPace < 200) {
            recommendations.push(`📉 UNDER ${finalTotal + 1} puntos`);
        }
    }
    if (Math.abs(localPredicted - visitorPredicted) > 5) {
        recommendations.push(`🎯 GANADOR: ${localPredicted > visitorPredicted ? localTeam : visitorTeam}`);
    }
    const specialBets = [];
    if (localAvgPF > 116 || visitorAvgPF > 116) {
        specialBets.push("🏀 Considerar apuestas de primer tiempo OVER");
    }
    if (localAvgPA < 108 && visitorAvgPA < 108) {
        specialBets.push("🛡️ Defensas sólidas - Evaluar UNDER");
    }
    if (ventajaLocal > 3.5) {
        specialBets.push("🏠 Fuerte ventaja de local");
    }
    let sugerencia = `🏠 ${localTeam}: ${localTier} (${(localWinPct * 100).toFixed(1)}%)\n`;
    sugerencia += `✈️  ${visitorTeam}: ${visitorTier} (${(visitorWinPct * 100).toFixed(1)}%)\n\n`;
    sugerencia += `🎯 PREDICCIÓN DE PUNTOS:\n`;
    sugerencia += `${localTeam}: ${localPredicted} pts\n`;
    sugerencia += `${visitorTeam}: ${visitorPredicted} pts\n`;
    sugerencia += `Total Esperado: ${finalTotal} pts\n\n`;
    sugerencia += `📈 LÍNEAS DE APUESTA:\n`;
    if (favorito === localTeam) {
        sugerencia += `Handicap: ${localTeam} ${favoritoSpread}\n`;
        sugerencia += `         ${visitorTeam} +${underdogSpread}\n`;
    } else {
        sugerencia += `Handicap: ${localTeam} +${underdogSpread}\n`;
        sugerencia += `         ${visitorTeam} ${favoritoSpread}\n`;
    }
    sugerencia += `Total: ${finalTotal} pts\n`;
    sugerencia += `Favorito: ${favorito} (${Math.abs(favoritoSpread)} pts)\n\n`;
    sugerencia += `🔥 ESTILOS DE JUEGO:\n`;
    sugerencia += `${localTeam}: ${localStyle} (${localPace.toFixed(1)} ritmo)\n`;
    sugerencia += `${visitorTeam}: ${visitorStyle} (${visitorPace.toFixed(1)} ritmo)\n\n`;
    sugerencia += `⚡ FACTORES CLAVE:\n`;
    sugerencia += `Ventaja Local: ${ventajaLocal} pts\n`;
    sugerencia += `Net Rating: ${localTeam} ${localNetRating.toFixed(1)} | ${visitorTeam} ${visitorNetRating.toFixed(1)}\n`;
    sugerencia += `Diferencia de Calidad: ${(qualityGap * 100).toFixed(1)}% - Puntos Extra: ${extraPoints}\n`;
    sugerencia += `Confianza Handicap: ${spreadConfidence}\n`;
    sugerencia += `Confianza Total: ${totalConfidence}\n\n`;
    if (specialSituations.length > 0) {
        sugerencia += `🎪 SITUACIONES ESPECIALES:\n`;
        specialSituations.forEach(situation => {
            sugerencia += `${situation}\n`;
        });
        sugerencia += `\n`;
    }
    if (recommendations.length > 0) {
        sugerencia += `💡 RECOMENDACIONES PRINCIPALES:\n`;
        recommendations.forEach(rec => {
            sugerencia += `${rec}\n`;
        });
        sugerencia += `\n`;
    }
    if (specialBets.length > 0) {
        sugerencia += `🎲 APUESTAS ESPECIALES:\n`;
        specialBets.forEach(bet => {
            sugerencia += `${bet}\n`;
        });
        sugerencia += `\n`;
    }
    const summaryOptions = [
        `🎯 JUGADA RECOMENDADA: ${recommendations[0] || 'Evaluar líneas en vivo'}`,
        `💰 MEJOR VALOR: ${Math.abs(winPctDiff) > 0.15 ? 'Handicap' : 'Total'}`,
        `🔥 CONFIANZA: ${spreadConfidence === 'Alta' ? 'Alta en Handicap' : totalConfidence === 'Alta' ? 'Alta en Total' : 'Media - Juego equilibrado'}`
    ];
    const randomSummary = summaryOptions[Math.floor(Math.random() * summaryOptions.length)];
    sugerencia += randomSummary;
    console.log('Sugerencia calculada:', sugerencia);
    return sugerencia;
}
